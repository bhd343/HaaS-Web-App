def customEncrypt(s, n, d):
    ascl = ''.join(chr(i) for i in range(128))
    ascl = ascl[34:127]

    if n not in range(1, 99):
        raise Exception("n must be an integer between 1 and 98 (inclusive).")
    elif d not in [1, -1]:
        raise Exception("d must be 1 or -1.")
    elif not all(i in ascl for i in s):
        raise Exception("Password must only contain ASCII characters.")
    elif " " in list(s) or "!" in list(s):
        raise Exception("Spaces and exclamation marks are disallowed.")

    def valid_index(i, n, d):
        test = i + n * d
        if 0 <= test < 93:
            return test
        elif test >= 93:
            return valid_index(i - 93, n, d)
        else:
            return valid_index(i + 93, n, d)

    encryptedText = s[::-1]
    indexes = [valid_index(ascl.find(i), n, d) for i in encryptedText]
    encryptedList = list(encryptedText)
    for i in range(len(s)):
        encryptedList[i] = ascl[indexes[i]]
    encryptedText = "".join(i for i in encryptedList)
    return encryptedText

def encrypt(string):
    return customEncrypt(string, 3, -1)
    
if __name__ == "__main__":
    original = "#test123"
    encrypted = customEncrypt(original, 10, 1)
    decrypted = customEncrypt(encrypted, 10, -1)
    print(encrypted)
    print(decrypted)

