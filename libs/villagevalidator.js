import { connectToDatabase } from './db';
import VillageActivity from '../models/VillageActivity';
import VillageUser from '../models/VillageUser';

// Village Subscription Plan
const VILLAGE_ADMIN = 4;
const VILLAGE_SUPERUSER = 7;

export const validateAdmin = async (identityId, village, activity_description) => {
  await connectToDatabase();

  const foundUser = VillageUser.findOne({
    user_id: identityId
  });

  if (foundUser) {
    if ((foundUser.subscription_plan != VILLAGE_ADMIN)) {
      throw new Error("Auth Error: the requesting user isn't village admin");
    } else if (foundUser.village != village){
      throw new Error("Auth Error: unauthorized village access");
    }
  } else {
    throw new Error("Auth error: the requesting user data not found");
  }

  if (activity_description) {
    const newVillageActivity = {};

    newVillageActivity.village_user = foundUser._id;
    newVillageActivity.village = foundUser.village;
    newVillageActivity.activity_description = activity_description;
  
    await VillageActivity.create(newVillageActivity);
  }
};

export const validateSuperuser = async (identityId) => {
  await connectToDatabase();

  const foundUser = VillageUser.findOne({
    user_id: identityId
  });

  if (foundUser) {
    if ((foundUser.subscription_plan != VILLAGE_SUPERUSER)) {
      throw new Error("Auth Error: the requesting user isn't village superuser");
    }
  } else {
    throw new Error("Auth error: the requesting user data not found");
  }
};