(function() {
  var myConnector = tableau.makeConnector();
  var datasetIndexCounter = 0;

  myConnector.getSchema = function (schemaCallback) {
    var cols = [{
      id: "datasetIndex",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "id",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "first_name",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "last_name",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "avatar",
      dataType: tableau.dataTypeEnum.string
    }]; 

    var tableSchema = {
      id: "UserResponseFeed",
      alias: "Users",
      columns: cols
    };

    schemaCallback([tableSchema]);
  };

  function fetchAllUserData(page, table, doneCallback) {
    $.ajax({
      url: 'https://reqres.in/api/users?page=' + page + '&per_page=5',
      type: 'GET',
      dataType: 'json',
      success: function(resp) {
        var users = resp.data || [];
        var tableData = [];

        users.forEach(function(user) {
          tableData.push({
            datasetIndex: datasetIndexCounter++,
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar
          });
        });

        table.appendRows(tableData);

        if (resp.total_pages > page) {
          return fetchAllUserData(page + 1, table, doneCallback);
        } else {
          return doneCallback();
        }
      },
      error: function() {
        alert('Did not work!');
      }
    })
  }

  myConnector.getData = function(table, doneCallback) {
    fetchAllUserData(1, table, doneCallback);
  };

  tableau.registerConnector(myConnector);

  $(document).ready(function () {
    $("#submitButton").click(function () {
      tableau.connectionName = "User Response Feed";
  
      tableau.submit();
    });
  });
})();