// Collects the date answers across pages and emails them on the last page.

// Where the answers get sent. After FormSubmit's first activation email you can
// replace this with the random alias it gives you, to keep your address out of the source.
var DATE_PLAN_EMAIL = "noah.vth04@gmail.com";

var DATE_PLAN_KEY = "datePlan";

function loadDatePlan() {
  try {
    return JSON.parse(sessionStorage.getItem(DATE_PLAN_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveDatePlan(field, value) {
  var plan = loadDatePlan();
  plan[field] = value;
  try {
    sessionStorage.setItem(DATE_PLAN_KEY, JSON.stringify(plan));
  } catch (e) {}
}

// Saves the values of all checked boxes with the given name, then moves on.
function saveCheckedAndGo(name, nextPage) {
  var checked = document.querySelectorAll('input[name="' + name + '"]:checked');
  var values = Array.prototype.map.call(checked, function (box) {
    return box.value;
  });
  saveDatePlan(name, values);
  location.href = nextPage;
}

function sendDatePlan() {
  var plan = loadDatePlan();
  if (plan.sent) return; // don't email again on refresh

  fetch("https://formsubmit.co/ajax/" + DATE_PLAN_EMAIL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: "💖 Valentine date decision",
      _template: "table",
      _captcha: "false",
      date: plan.date || "not chosen",
      food: (plan.food || []).join(", ") || "none",
      dessert: (plan.dessert || []).join(", ") || "none",
      activities: (plan.activities || []).join(", ") || "none",
    }),
  })
    .then(function (response) {
      if (response.ok) saveDatePlan("sent", true);
    })
    .catch(function (error) {
      console.error("Could not send date plan", error);
    });
}
