<?php
// Database connection configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Manpro";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get the SQL query from the AJAX request
$sqlQuery = $_POST['sqlQuery'];

// Perform the query
$result = $conn->query($sqlQuery);

// Display the result in a simple table format
if ($result->num_rows > 0) {
  echo "<table border='1'><tr><th>Column 1</th><th>Column 2</th></tr>";
  while($row = $result->fetch_assoc()) {
    echo "<tr><td>" . $row["column1"] . "</td><td>" . $row["column2"] . "</td></tr>";
  }
  echo "</table>";
} else {
  echo "0 results";
}

// Close the database connection
$conn->close();
?>