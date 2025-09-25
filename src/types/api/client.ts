export interface GuideDetailsForClientDto{
  _id : string;
  firstName : string;
  lastName : string;
  email : string;
  phone : string;
  alternatePhone : string;
  bio : string;
  profileImage : string;
  yearOfExperience : string;
  languageSpoken : string[];
  totalTrips : number;
}

export interface IGetGuideDetailsClient{
  guide : GuideDetailsForClientDto
}