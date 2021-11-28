export const beautifyDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};
export interface DateChecked {
  answer: boolean;
  message: string;
}
export const checkStartEndDate = (
  startDate: string,
  endDate: string
): DateChecked => {
  const currentDate = new Date().toISOString().split("T")[0];
  const checked = {
    answer: false,
    message: "",
  };
  if (currentDate > startDate) {
    checked.answer = false;
    checked.message =
      "from date can't be lower than the current date, either equal or bigger";
    return checked;
  }
  if (startDate >= endDate) {
    checked.answer = false;
    checked.message = "To date should be at least 1 day more than from date";
    return checked;
  }
  return {
    answer: true,
    message: "All good",
  };
};
