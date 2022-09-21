import os

from flask import Flask, request
import json
from flask_cors import CORS, cross_origin
from python_helpers import mongo_docs
from python_helpers import encrypy
from flask_pymongo import PyMongo

app = Flask(__name__, static_folder='re/build', static_url_path="/")
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["MONGO_URI"] = os.environ["DB_URL"]
mongo = PyMongo(app)


@app.route("/monitor")
def monitor():
    return str(mongo.cx.get_database("TestDatabase").get_collection("Users").find_one())


@app.route("/dbstatus")
def dbstatus():
    return str(mongo.cx.get_database("hm").get_collection("users").find_one())


@app.route("/account", methods=["POST"])
@cross_origin()
def account():
    j = request.get_json()
    email = encrypy.encrypt(j["email"].strip())
    password = encrypy.encrypt(j["password"].strip())
    user = mongo.cx.get_database("hm").get_collection("users").find_one({"email": email, "password": password})
    if user:
        user["status"] = "Success"
        return json.dumps({"status": "You're signed in!", "code": True})
    else:
        return json.dumps({"status": "Sign in failed", "code": False})


@app.route("/project/<id>", methods=["GET"])
@cross_origin()
def project_GET(id):
    proj = mongo.cx.get_database("hm").get_collection("projects").find_one({"id": id})
    if proj:
        proj["status"] = "Here's project {} for you".format(proj["name"])
        proj["code"] = True
        proj["_id"] = str(proj["_id"])
        return json.dumps(proj)
    else:
        return json.dumps({"status": "Project not found", "code": False})


@app.route("/project", methods=["POST"])
@cross_origin()
def project_POST():
    j = request.get_json()
    id = j["id"]
    return project_GET(id)


@app.route("/resource/<id>")
@cross_origin()
def resource(id):
    try:
        id = int(id)
    except ValueError:
        pass
    r = mongo.cx.get_database("hm").get_collection("resources").find_one({"id": id})
    if r:
        r["status"] = "Success"
        r["code"] = True
        r["_id"] = str(r["_id"])
        return json.dumps(r)
    else:
        return json.dumps({"status": "Failure", "code": False})


@app.route("/order", methods=["POST"])
@cross_origin()
def order():
    j = request.get_json()
    project_id = j["project_id"].strip()
    resource_id = int(j["resource_id"])
    quantity = j["quantity"]
    result = create_order(project_id, resource_id, quantity)

    ret = result["code"]
    if ret:
        term = "Check in" if quantity < 0 else "Check out"
        return json.dumps({"status": "{} placed for {} units of resource {} by project {}".format(term,
                                                                                                  abs(quantity),
                                                                                                  resource_id,
                                                                                                  project_id),
                           "code": True})
    else:
        return json.dumps({"status": result["message"], "code": result["code"]})


@app.route("/new_account", methods=["POST"])
@cross_origin()
def new_account():
    j = request.get_json()
    email = j["email"].strip()
    password = j["password"].strip()
    result = create_account(email, password)
    if result:
        return json.dumps({"status": "Account created!", "code": True})
    else:
        return json.dumps({"status": "An account with this email exists", "code": False})


@app.route("/new_project", methods=["POST", "GET"])
@cross_origin(methods=["POST", "GET"])
def new_project():
    j = request.get_json()
    project_id = j["id"].strip()
    project_name = j["name"].strip()
    project_description = j["description"].strip()
    if create_project(project_id, project_name, project_description):
        return json.dumps({"status": "Created your project!", "code": True})
    else:
        return json.dumps({"status": "A project with this ID already exists", "code": False})


def create_account(email, password):
    # encrypt email and password using encrypy.encrypt()
    # if there is not a user with this encrypted email in the database, insert the encrypted data into the database
    # using a User() Class instance
    u = mongo_docs.User(email, password)
    if not mongo.cx.get_database("hm").get_collection("users").find_one({"email": u.email}):
        mongo.cx.get_database("hm").get_collection("users").insert_one(u.mongo())
        return True
    else:
        # throw error message, user already exists at that email
        return False


def create_project(project_id, project_name, project_description):
    # if there is not a project in the database with "name":project_name, then create a new one
    # and reroute the user to that project's page
    if not mongo.cx.get_database("hm").get_collection("projects").find_one({"id": project_id}):
        mongo.cx.get_database("hm").get_collection("projects").insert_one(mongo_docs.Project(project_id,
                                                                                             project_name,
                                                                                             project_description).mongo())
        return True
    else:
        return False


def create_order(project_id, resource_id, quantity):
    status = {}
    # Insert the order into the database using an Order() instance (see python_helpers.mongo_docs)
    # Communicate with the database and check in / check out resources if they are available.
    if res := mongo.cx.get_database("hm").get_collection("resources").find_one({"id": resource_id}):
        new_availability = res["availability"] - quantity
        if 0 <= new_availability <= res["capacity"]:
            mongo.cx.get_database("hm").get_collection("resources"). \
                find_one_and_update({"id": resource_id}, {"$set": {"availability": new_availability,
                                                                   "checked_out": res["capacity"] - new_availability}})
            mongo.cx.get_database("hm").get_collection("orders"). \
                insert_one(mongo_docs.Order(project_id, abs(quantity), resource_id, checkin=quantity < 0).mongo())
            status = {"code": True, "message": "Order Placed"}
            return status
        else:
            # This resource doesn't exist or the capacity / availability / requested amount don't align.
            mongo.cx.get_database("hm").get_collection("orders"). \
                insert_one(
                mongo_docs.Order(project_id, abs(quantity), resource_id, checkin=quantity < 0, successful=False).
                mongo())

            if quantity < 0 and res['capacity'] <= abs(quantity):
                status = {"code": False, "message": "Check in quantity cannot exceed capacity."}
                return status
            elif quantity >= 0 and abs(quantity) > res['availability']:
                status = {"code": False, "message": "Check out quantity cannot exceed availability."}
                return status
            else:
                status = {"code": True, "message": "Order Placed"}
                return status

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
