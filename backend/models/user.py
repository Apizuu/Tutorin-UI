from mongoengine import Document, StringField, FloatField, IntField

class User(Document):
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    year_joined = IntField(required=True)
    major = StringField(required=True)
    faculty = StringField(required=True)
    balance = FloatField(default=0.0)

    def to_dict(self):
        return {
            "username": self.username,
            "year_joined": self.year_joined,
            "major": self.major,
            "faculty": self.faculty,
            "balance": self.balance
        }

