export interface CreateGatheringRequest {
  title: string;
  startDate: string;
  endDate: string;
  meetingLocation: {
    placeId: string;
  };
  memo: string;
  userIds: string[];
}
