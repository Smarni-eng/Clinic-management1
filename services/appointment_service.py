# Contains business logic (validation, processing, rules)
# Does NOT know about HTTP — only works with Python data

from database.queries_appointment import (
    db_get_all
    , db_get_one
    , db_create
    , db_update
    , db_delete
)


def service_get_all():
    return db_get_all()


def service_get_one(appointment_id):
    return db_get_one(appointment_id)


def service_create(data):
    return db_create(data)


def service_update(appointment_id, data):
    return db_update(appointment_id, data)


def service_delete(appointment_id):
    return db_delete(appointment_id)
