import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //req.body has the res from the user stored we are destructuring it.
  const { fullName, userName, email, password } = req.body;

  //validation for fields not empty.
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //checking existing user.
  const existedUser = User.findOne({
    $or: [{ userName }, { email }],
  });
  console.log(existedUser);

  if (existedUser) {
    throw new ApiError(
      409,
      "User already exist with the same email and username"
    );
  }

  //checking files and validation for cover image and avatar image.
  req.files && console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log(avatarLocalPath);

  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  console.log(coverImageLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  //Uploading in cloudinary.
  //The reason for using async method was to use await here for cloudinary to upload the path to their serve.
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log(avatar);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log(coverImage);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  //Entry in database with new object, while entrying we need to await bcoz database is in another continent.
  const user = await User.create({
    fullName: fullName.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  //_id is what mongoDB will create with every new document that is stored. So here we are checking for user.
  // .select is a method where we will not get two field by passing -string -string
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  //We are returing the data in json
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

// get user details from front-end;
// check validations - not empty;
// check if user already exist or not;
// check for required avatar is provided by user or not;
// upload them to cloudinary;
// create user object- create a entry in db;
// check for user create is done or not;
// remove password and refresh token from the entry and sent it to db;
// return object;

export { registerUser };
