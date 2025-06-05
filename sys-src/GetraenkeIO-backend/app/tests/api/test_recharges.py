import pytest
from ...models import User, RechargeBase
from ...crud.recharge import store_recharge_for_user_to_db, read_recharges_for_user_from_db
from fastapi import status

from ...api.dependencies import ERROR_FORBIDDEN
from ..testvariables import *
from ...api.routes.recharges import error_missing_user_by_id

NONEXISTEND_USER_ID = "d5ba2566-09b1-4c92-bda4-a6c07de21556"

def setup_named_user(db, name):
    user = User.model_validate(VALID_USER_JSON)
    user.name = name
    db.add(user)
    db.commit()
    return user

def api_path_from_uid(uid):
    return "/users/" + str(uid) + "/recharges"

@pytest.fixture(scope="function")
def setup_user(db, name=VALID_USER_NAME):
    return setup_named_user(db, name)

@pytest.fixture(scope="function")
def setup_admin(db):
    admin = User.model_validate(VALID_USER_JSON)
    admin.name = "admin"
    admin.is_admin = True
    db.add(admin)
    db.commit()
    return admin

@pytest.fixture(scope="function")
def setup_recharges(db, setup_user):
    recharges_base = [
            RechargeBase(amount=10.00), 
            RechargeBase(amount=12.50), 
            RechargeBase(amount=14.50)
            ]
    recharges = []

    for re in recharges_base:
        recharges.append(store_recharge_for_user_to_db(session=db, recharge=re, user=setup_user).model_dump(mode="json"))
    
    return recharges

@pytest.fixture(scope="function")
def api_path(setup_user):
    return api_path_from_uid(setup_user.id)

def test_read_own_recharges_authorized(client, api_path, setup_recharges):
    response = client.get(api_path, auth=(VALID_USER_NAME, VALID_USER_PASSWORD))

    assert response.status_code is status.HTTP_200_OK
    assert response.json() == setup_recharges

def test_read_other_recharges_unauthorized(db, client, api_path):
    other_user = setup_named_user(db, "otherUser")

    response = client.get(api_path, auth=(other_user.name, VALID_USER_PASSWORD))

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()["detail"] == ERROR_FORBIDDEN

def test_admin_read_recharges_authorized(client, api_path, setup_recharges, setup_admin):
    response = client.get(api_path, auth=(setup_admin.name, VALID_USER_PASSWORD))

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == setup_recharges

def test_admin_read_recharges_of_nonexistend_user_authorized(client, setup_admin, setup_recharges):
    response = client.get(api_path_from_uid(NONEXISTEND_USER_ID), auth=(setup_admin.name, VALID_USER_PASSWORD))

    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_post_own_recharge_forbidden(client, api_path, setup_user):
    response = client.post(
        api_path, 
        auth=(setup_user.name, VALID_USER_PASSWORD), 
        content=RechargeBase(amount=10.00).model_dump_json()
        )

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()["detail"] == ERROR_FORBIDDEN

def test_admin_post_recharge_ok(db, client, api_path, setup_user, setup_admin):
    recharge = RechargeBase(amount=10.00)
    response = client.post(api_path, auth=(setup_admin.name, VALID_USER_PASSWORD), content=recharge.model_dump_json())

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == read_recharges_for_user_from_db(db, setup_user)[0].model_dump(mode="json")
    
    db.refresh(setup_user)
    assert setup_user.guthaben == VALID_USER_JSON["guthaben"] - recharge.amount

def test_admin_post_recharge_nonexistent_user(client, setup_admin):
    response = client.post(NONEXISTEND_USER_ID, auth=(setup_admin.name, VALID_USER_PASSWORD), content=RechargeBase(amount=10.00).model_dump_json())

    assert response.status_code == status.HTTP_404_NOT_FOUND