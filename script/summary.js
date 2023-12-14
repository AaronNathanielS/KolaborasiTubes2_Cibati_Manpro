function fetchData() {
  const sqlQuery = document.getElementById("sqlCode").value;

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      document.getElementById("result").innerHTML = xhr.responseText;
    }
  };
  xhr.open("POST", "process_query.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send("sqlQuery=" + encodeURIComponent(sqlQuery));
} 
