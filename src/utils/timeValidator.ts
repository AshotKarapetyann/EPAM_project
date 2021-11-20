async function timeValidator(time:string) {
    if(!time){
        return true;
    }
    const split = time.split(":");
    const hour = +split[0];
    const minute = +split[1];
    const second = +split[2];
    if (time === "24:00:00") {
      return true;
    }
    if (hour > 24) {
      return false;
    }
    if (minute > 59) {
      return false;
    }
    if (second > 59) {
      return false;
    }
    return true;
};
export default timeValidator;

