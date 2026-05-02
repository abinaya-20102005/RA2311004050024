import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Select,
  Box,
} from "@mui/material";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewed, setViewed] = useState([]);

  const priorityMap = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://20.207.122.201/evaluation-service/notifications",
        {
          headers: {
            Authorization: "Bearer test",
          },
        }
      );

      const data = await response.json();

      if (!data.notifications) {
        setError("Invalid API response");
        return;
      }

      setNotifications(data.notifications);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Sorting logic
  const sorted = [...notifications].sort((a, b) => {
    if (priorityMap[b.Type] !== priorityMap[a.Type]) {
      return priorityMap[b.Type] - priorityMap[a.Type];
    }
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });

  const top10 = sorted.slice(0, 10);

  const filtered =
    filter === "ALL"
      ? sorted
      : sorted.filter((n) => n.Type === filter);

  const renderCard = (n, index) => (
    <Card
      key={index}
      onClick={() => setViewed([...viewed, n.ID])}
      sx={{
        mb: 2,
        border: index < 10 ? "2px solid red" : "1px solid #ccc",
        backgroundColor: viewed.includes(n.ID) ? "#eee" : "#fff",
        cursor: "pointer",
      }}
    >
      <CardContent>
        <Typography variant="h6">{n.Type}</Typography>
        <Typography>{n.Message}</Typography>
        <Typography variant="caption">{n.Timestamp}</Typography>
      </CardContent>
    </Card>
  );

  // UI states
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Notification System</Typography>

      {/* Filter */}
      <Box sx={{ mt: 3 }}>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
        </Select>
      </Box>

      {/* Top 10 */}
      <Typography variant="h5" sx={{ mt: 3 }}>
        🔥 Top 10 Notifications
      </Typography>
      {top10.map(renderCard)}

      {/* All */}
      <Typography variant="h5" sx={{ mt: 3 }}>
        📋 All Notifications
      </Typography>
      {filtered.map(renderCard)}
    </Container>
  );
}

export default App;