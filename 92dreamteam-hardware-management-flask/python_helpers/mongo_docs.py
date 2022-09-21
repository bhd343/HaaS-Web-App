from python_helpers.encrypy import encrypt
from datetime import datetime as dt
import json


class User:
    def __init__(self, email, password, projects=[]) -> None:
        self.email = encrypt(email)
        self.password = encrypt(password)
        self.projects = projects

    def mongo(self):
        return {"email": self.email,
                "password": self.password,
                "projects": self.projects}

    def __str__(self) -> str:
        return json.dumps({"email": self.email,
                           "password": self.password,
                           "projects": self.projects})


class Resource:
    def __init__(self, id, capacity, description, name) -> None:
        self.id = id
        self.capacity = capacity
        self.availability = capacity
        self.checked_out = 0
        self.description = description
        self.name = name

    def get_capacity(self):
        return self.capacity

    def get_availability(self):
        return self.availability

    def get_checkedout_qty(self):
        return self.checked_out

    def check_out(self, qt):  # If there are not qt items available, check out total available
        if self.get_availability() >= qt:
            self.availability -= qt
            self.checked_out += qt
        else:
            print("{} items not available for checkout. Checking out {} items instead.".format(qt,
                                                                                               self.get_availability()))
            self.availability = 0
            self.checked_out = self.get_capacity()
            return -1

    def check_in(self, qt):  # Only allow users to check in qt if there are qt items checked out
        if self.get_checkedout_qty() >= qt:
            self.availability += qt
            self.checked_out -= qt
        else:
            print("{} is greater than the number of checked out items.".format(qt))

    def mongo(self):
        return {"id": self.id,
                "name": self.name,
                "description": self.description,
                "capacity": self.capacity,
                "availability": self.availability,
                "checked_out": self.checked_out}

    def __str__(self) -> str:
        return json.dumps(self.mongo())


class Project:
    def __init__(self, id, name, description, owner=None, resources=[1, 2], users=[]) -> None:
        self.id = id
        self.name = name
        self.description = description
        self.owner = owner
        self.resources = resources
        self.users = users

    def mongo(self):
        return {"id": self.id,
                "name": self.name,
                "description": self.description,
                "owner": self.owner,
                "resources": self.resources,
                "users": self.users}

    def __str__(self) -> str:
        return json.dumps(self.mongo())


class Order:
    def __init__(self, project, qty, resource, checkin=False, time=dt.now(), successful=True) -> None:
        self.project = project
        self.qty = qty
        self.resource = resource
        self.checkin = checkin
        self.time = time
        self.successful = successful

    def mongo(self):
        return {"project": self.project,
                "qty": self.qty,
                "resource": self.resource,
                "checkin": self.checkin,
                "time": self.time,
                "successful": self.successful}

    def __str__(self) -> str:
        return json.dumps({"project": self.project,
                           "qty": self.qty,
                           "resource": self.resource,
                           "checkin": self.checkin,
                           "time": self.time,
                           "successful": self.successful})


class Permission:
    def __init__(self, project, user, level) -> None:
        self.project = project
        self.user = user
        self.level = level

    def __str__(self) -> str:
        return json.dumps({"project": self.project,
                           "user": self.user,
                           "level": self.level})
