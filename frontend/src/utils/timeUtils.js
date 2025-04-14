import moment from "moment-timezone";

export const getBangkokTime = () => {
  return moment().tz("Asia/Bangkok").toDate();
};
