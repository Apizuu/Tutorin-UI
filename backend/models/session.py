from mongoengine import Document, StringField, FloatField, IntField, ListField

class Session(Document):
    tutor = StringField(required=True)
    date = StringField(required=True)
    location = StringField(required=True)
    limit = IntField(required=True)
    fee = FloatField(required=True)
    tutees = ListField(StringField())

    def to_dict(self):
        return {
            "id": str(self.id),
            "tutor": self.tutor,
            "date": self.date,
            "location": self.location,
            "limit": self.limit,
            "fee": self.fee,
            "tutees": self.tutees
        }

    @staticmethod
    def has_conflict(username, date):
        return Session.objects(tutees=username, date=date).first() is not None

