export const exerciseCatalog = [
  {
    name: "Push Up",
    video: "https://www.youtube.com/watch?v=_l3ySVKYVJ8"
  },
  {
    name: "Dumbbell Curl",
    video: "https://www.youtube.com/watch?v=sAq_ocpRh_I"
  },
  {
    name: "Squat",
    video: "https://www.youtube.com/watch?v=aclHkVaku9U"
  },
  {
    name: "Pull Up",
    video: "https://www.youtube.com/watch?v=eGo4IYlbE5g"
  }
];
export function suggestWeight(name, gender, experience) {
  if (name === "Push Up" || name === "Pull Up" || name === "Squat") return "Bodyweight";
  if (gender === "Male" && experience === "Advanced") return "15kg";
  if (gender === "Male") return "10kg";
  if (gender === "Female" && experience === "Advanced") return "8kg";
  if (gender === "Female") return "5kg";
  return "5kg";
}
