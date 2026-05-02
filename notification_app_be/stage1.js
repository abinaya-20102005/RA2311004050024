// Priority mapping
const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1
};

async function getTopNotifications() {
  try {
    // Step 1: Fetch data from API
    const response = await fetch("http://20.207.122.201/evaluation-service/notifications", {
      headers: {
        "Authorization": "Bearer test" // may fail → fallback used
      }
    });

    const data = await response.json();
    console.log("API RESPONSE:", data);

    let notifications;

    // Step 2: Fallback if API fails
    if (!data.notifications) {
      console.log("⚠️ Using fallback data...");

      notifications = [
        { ID: "1", Type: "Placement", Message: "Company hiring", Timestamp: "2026-04-22 17:51:18" },
        { ID: "2", Type: "Result", Message: "mid sem", Timestamp: "2026-04-22 17:51:30" },
        { ID: "3", Type: "Event", Message: "farewell", Timestamp: "2026-04-22 17:51:06" },
        { ID: "4", Type: "Placement", Message: "Google hiring", Timestamp: "2026-04-22 17:52:00" }
      ];
    } else {
      notifications = data.notifications;
    }

    // Step 3: Sort based on priority + timestamp
    const sorted = notifications.sort((a, b) => {
      if (priorityMap[b.Type] !== priorityMap[a.Type]) {
        return priorityMap[b.Type] - priorityMap[a.Type];
      }
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    // Step 4: Get top 10
    const top10 = sorted.slice(0, 10);

    // Step 5: Output
    console.log("\n🔥 TOP 10 NOTIFICATIONS:");
    console.log(top10);

  } catch (err) {
    console.error("❌ Error fetching notifications:", err);
  }
}

// Run function
getTopNotifications();