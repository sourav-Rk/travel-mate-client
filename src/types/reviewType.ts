export interface ReviewListDto{
    _id : string;
    userId : {
        _id : string;
        firstName : string;
        lastName : string;
    }
    rating : number;
    comment : string;
    createdAt : Date;
}

export interface IReviewsResponse {
  success: boolean;
  message: string;
  data: {
    reviews: ReviewListDto[];
    averageRating: number;
    totalReviews: number;
  };
}