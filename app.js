
let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click" , e =>{
    e.preventDefault();

    let form = e.target.parentElement;
    let toDOList = form.children[0].value;
    let month = form.children[1].value;
    let day = form.children[2].value;

    if (toDOList === ""){
        alert("Please Enter something");
        return;
    }

    let toDo = document.createElement("div");
    toDo.classList.add("toDo");
    toDo.style.animation="scaleUp 0.5s forwards";
    let list = document.createElement("h4");
    list.classList.add("list");
    list.innerText = toDOList;
    let date = document.createElement("h4");
    date.classList.add("date");
    date.innerText = month + "/" + day;
    let check = document.createElement("button");
    check.classList.add("check");
    check.innerHTML = '<i class="fas fa-check"></i>';
    let trash = document.createElement("button");
    trash.classList.add("trash");
    trash.innerHTML = '<i class="fas fa-trash"></i>';
    
    toDo.appendChild(list);
    toDo.appendChild(date);
    toDo.appendChild(check);
    check.addEventListener("click",e =>{
        e.target.parentElement.classList.toggle("checked");
    })
    toDo.appendChild(trash);
    trash.addEventListener("click",e=>{
        let toDOitem = e.target.parentElement;
        toDOitem.addEventListener("animationend",()=>{
            let text = toDOitem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach( (item,index)=> {
                if (item.todoText == text){
                    myListArray.splice(index,1);
                    localStorage.setItem("list",JSON.stringify(myListArray));
                }
            })
            toDOitem.remove();
        })
        toDOitem.style.animation="scaleDown 0.5s forwards";

    })
    //create an object
    let myTodo = {
        todoText: toDOList,
        todoMonth: month,
        todoDate: day
    };

    // store data into an array of object
    let myList = localStorage.getItem("list");
    if (myList == null){
        localStorage.setItem("list",JSON.stringify([myTodo]));
    }else{
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list",JSON.stringify(myListArray));
    }
    console.log(JSON.parse(localStorage.getItem("list")));

    form.children[0].value = "";
    form.children[1].value = "";
    form.children[2].value = "";

    section.appendChild(toDo);
})

loadData();

function loadData(){
    let myList = localStorage.getItem("list");
    if (myList !== null){
        let myListArray = JSON.parse(myList);
        myListArray.forEach(item =>{
            let toDo = document.createElement("div");
            toDo.classList.add("toDo");
            let list = document.createElement("h4");
            list.classList.add("list");
            let date = document.createElement("h4");
            date.classList.add("date");

            list.innerText = item.todoText;
            date.innerText = item.todoMonth+"/"+item.todoDate;

            toDo.appendChild(list);
            toDo.appendChild(date);
            let check = document.createElement("button");
            check.classList.add("check");
            check.innerHTML = '<i class="fas fa-check"></i>';
            let trash = document.createElement("button");
            trash.classList.add("trash");
            trash.innerHTML = '<i class="fas fa-trash"></i>';
            toDo.appendChild(check);
            check.addEventListener("click",e =>{
                e.target.parentElement.classList.toggle("checked");
            })
            toDo.appendChild(trash);
            trash.addEventListener("click",e=>{
                let toDOitem = e.target.parentElement;
                toDOitem.addEventListener("animationend",()=>{
                    let text = toDOitem.children[0].innerText;
                    let myListArray = JSON.parse(localStorage.getItem("list"));
                    myListArray.forEach( (item,index)=> {
                        if (item.todoText == text){
                            myListArray.splice(index,1);
                            localStorage.setItem("list",JSON.stringify(myListArray));
                        }
                    })
                        toDOitem.remove();
                })
                toDOitem.style.animation="scaleDown 0.5s forwards";
            })
            section.appendChild(toDo);
        })
    }
}

function mergeTime (arr1,arr2){
    result=[];
    i=0;
    j=0;
    while ( i<arr1.length && j<arr2.length){
        if( Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)){
            result.push(arr1[i]);
            i++;
        }else if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)){
            result.push(arr2[j]);
            j++;
        }else if( Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)){
            if(Number(arr1[i].todoDate) < Number(arr2[j].todoDate)){
                result.push(arr1[i]);
                i++;
            }else{
                result.push(arr2[j]);
                j++;
            }
        }
    }
    while( i<arr1.length){
        result.push(arr1[i]);
        i++;
    }
    while( j<arr2.length){
        result.push(arr2[j]);
        j++;
    }
    return result;
} 

function mergeSort(arr){
    if ( arr.length === 1){
        return arr;
    }else{
        let middle = Math.floor(arr.length / 2);
        let left = arr.slice(0,middle);
        let right = arr.slice(middle , arr.length);
        return mergeTime(mergeSort(left), mergeSort(right));
    }
}

let sortButton = document.querySelector("div.sort");
sortButton.addEventListener("click" , () =>{
    let sortArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortArray));
    
    let len = section.children.length;
    for (let i = 0; i<len ; i++){
        section.children[0].remove();
    }

    loadData();
})