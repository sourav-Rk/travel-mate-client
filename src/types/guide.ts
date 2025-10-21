//guide profile dto
  export interface GuideProfileDto {
    firstName : string;
    lastName : string;
    email : string;
    phone : string;
    alternatePhone : string;
    status : "verified" | "pending";
    bio : string;
    dob : string;
    profileImage : string;
    yearOfExperience : string;
    languageSpoken : string[];
    documents : string[];
    gender : "male" | "female" | "other"
  }

//guide list for vendor table listing
export interface GuideListVendorDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  gender: string;
  alternatePhone : string;
  languageSpoken : string[];
  yearOfExperience : string;
  profileImage : string;
  isAvailable : boolean;
  dob ?:Date;
  role ?: "guide";
  documents ?: string[];
}
