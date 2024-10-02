


const apiUrl = "https://66f2679271c84d8058751767.mockapi.io/calculator";


const description = document.getElementById("description");
const amount = document.getElementById("Amount")
const type = document.getElementById("type")
const addBtn = document.getElementById("add")
const totalIncomeElement = document.getElementById("totalIncome");
const totalExpenseElement = document.getElementById("totalExpense")
const totalBalanceElement = document.getElementById("totalBalance")

addBtn.addEventListener("click", async function add() {
    if (description.value == "" || amount.value == "" || type.value == "") {
        alert("Fill the all Fileds")
        return;
    }

    try {
        const addData = {
            description: description.value,
            amount: amount.value,
            type: type.value,
            edit: "edit",
            delete: "delete"
        };

        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(addData)
        
        });
         const data = await res.json();
         fetchdisplay(document.getElementById("tbody"));
        
    } catch (err) {
        console.log(err)
    } finally {
        (description.value = ""),
            (amount.value = ""),
            (type.value = "")
            
    }
    

});


const tbody = document.getElementById("tbody")
 const tbodyRows = fetchdisplay(tbody)


async function fetchdisplay(element, filterValue = "") {
    try {
      element.innerHTML = "";
      const data = await fetch(apiUrl);
      const resiveData = await data.json();

      let totalIncome = 0;
      let totalExpense = 0;

      resiveData
        .filter((item) => filterValue === "" || item.type === filterValue)
        .forEach((resiveData) => {
          const trow = element.appendChild(document.createElement("tr"));
          trow.classList = "border-b-2";
          const description = trow.appendChild(document.createElement("td"));
          description.classList = "px-4 py-2";
          description.textContent = resiveData.description;

          const amount = trow.appendChild(document.createElement("td"));
          amount.classList = "py-2 px-4 ";
          amount.textContent = resiveData.amount;
          const type = trow.appendChild(document.createElement("td"));
          type.classList = "px-4 py-2";
          type.textContent = resiveData.type;

          const action = trow.appendChild(document.createElement("td"));
          action.classList = "px-4 py-2 flex";
          const span1 = action.appendChild(document.createElement("span"));
          span1.classList =
            "text-blue-500 hover:cursor-pointer active:text-blue-900  px-2 ";
          span1.textContent = "Edit";
          const span2 = action.appendChild(document.createElement("span"));
          span2.classList =
            "text-red-400 hover:cursor-pointer active:text-red-600  px-2 ";
            span2.textContent = "Delete";
            
             span1.addEventListener("click", () => {
               if (span1.textContent === "Edit") {
                 description.innerHTML = `<input type="text" value="${resiveData.description}">`;
                 amount.innerHTML = `<input type="number" value="${resiveData.amount}">`;
                 type.innerHTML = `<input type="text" value="${resiveData.type}">`;
                 span1.textContent = "Save";
               } else {
                 const updatedDescription =
                   description.querySelector("input").value;
                 const updatedAmount = amount.querySelector("input").value;
                 const updatedType = type.querySelector("input").value;

                 updateData(
                   resiveData.id,
                   updatedDescription,
                   updatedAmount,
                   updatedType
                 );
                 span1.textContent = "Edit";
               }
             });

          span2.addEventListener("click", () => {
            deleteData(resiveData.id);
          });



            

          if (resiveData.type === "Income") {
            totalIncome += parseFloat(resiveData.amount);
          } else if (resiveData.type === "Expense") {
            totalExpense += parseFloat(resiveData.amount);
          }
        });

        totalIncomeElement.textContent = totalIncome.toFixed(2)
        totalExpenseElement.textContent = totalExpense.toFixed(2)
        totalBalanceElement.textContent = (totalIncome - totalExpense).toFixed(2)
    } catch (err) {
        console.warn(err)
    }
}


async function updateData(id, description, amount, type) {
  try {
    const updateData = {
      description: description,
      amount: parseFloat(amount),
      type: type,
    };

    const res = await fetch(apiUrl + "/" + id, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    fetchdisplay(document.getElementById("tbody"));
  } catch (err) {
    console.warn(err);
  }
}

async function deleteData(id) {
  try {
    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    });
    fetchdisplay(document.getElementById("tbody")); 
  } catch (err) {
    console.log(err);
  }
}





const optionType = document.getElementById("option")

const all = document.getElementById("all")
const income = document.getElementById("income");
const expense = document.getElementById("expense")

optionType.addEventListener("change", () => {
    fetchdisplay(document.getElementById("tbody"), optionType.value);

})




