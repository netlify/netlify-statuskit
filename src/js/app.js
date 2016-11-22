// JS Goes here - ES6 supported
const daysSince = document.getElementById("days-since-latest");
console.log(daysSince);
if (daysSince) {
  const aDay = 1000*60*60*24;
  const dateSince = daysSince.getAttribute("data-latest-incident-date");

  const timeSince = new Date() - new Date(dateSince);
  const endDays = Math.floor(timeSince / aDay);

  const count = endDays == 1 ? `${endDays} day` : `${endDays} days`;
  daysSince.innerHTML = `${count} since last incident`;
}
