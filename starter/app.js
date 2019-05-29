//Budgte controller module
var Budgetcontroller=(function(){
    var Expenses=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    this.percentage=-1;    
    };
    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        
        
    };
    
    Expenses.prototype.calcperc=function(totalincome){
if(totalincome>0){
        this.percentage=Math.round((this.value/totalincome)*100);
}
        else{
            this.percentage=-1;
        }
          
    };
    
    Expenses.prototype.getpercentage=function(){
      return this.percentage;  
    };
    
    var data={
        allitem:{
            exp:[],
            inc:[]
            
    },
        totals:{
            exp:0,
            inc:0
        },
budget:0,
        percentage:-1
        
    };
    
    var calculatetotal=function(type){
        var sum=0;
data.allitem[type].forEach(function(cur){
    sum+=cur.value;
});
    data.totals[type]=sum;
    
    };
    return {
        additem:function(type,des,val){
            var ID,newitem;
            //1. crating new id
        if(data.allitem[type].length>0){
            ID=data.allitem[type][data.allitem[type].length-1].id +1;
  
        }else{
            ID=0;
        }
                      
            //2. creating new item based on inc and exp type
            if(type==="exp"){
                newitem=new Expenses(ID,des,val);
            }
            else if(type==="inc"){
                newitem=new Income(ID,des,val);
            }
            
            //3 push it to the dat structurre
            data.allitem[type].push(newitem);
            //4 return the new element
            return newitem;
        },
        
        calculatebudget:function(){
          //calculate the totla income and expenses 
            calculatetotal('exp');
            calculatetotal('inc');
            //calculate the budget total expenses -total income
        data.budget=data.totals.inc-data.totals.exp;    
            
            //calculate the percentage
            if(data.totals.inc>0){
            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
      }else{
          data.percentage=-1;
      }
                  },

        deleteitem:function(type,id){
        //in this method we simply find id and then index of id and simply delete them 
            var ids,index;
            ids=data.allitem[type].map(function(current){
               return current.id;
            });
            index=ids.indexOf(id);
            if(index!== -1){
            data.allitem[type].splice(index,1);
    
            }
                        
        },
        calculatepercnt:function(){
            data.allitem.exp.forEach(function(current){
                current.calcperc(data.totals.inc);                    
                                      });
        },
        
        getpercent:function(){
            
            var allpercentages=data.allitem.exp.map(function(current){
              return current.getpercentage(); 
            });
            return allpercentages;
        },
        
        returnbudget:function(){
          return {
              totalinc:data.totals.inc,
              totalexp:data.totals.exp,
              budget:data.budget,
              percnt:data.percentage
          };  
        },
        
        testing:function(){
        console.log(data);
    }
    
    };
    
    
})();

//UI controller module
var UIcontroller=(function(){
    var domstring={
        type:'.add__type',
        description: '.add__description',
        inputvalue: '.add__value',
        mouse:'.add__btn',
        incomecontainer:'.income__list',
        expensecontainer:'.expenses__list',
        container:'.container',
        budgetlabel: '.budget__value',
        incomelabel:'.budget__income--value',
        expenseslabel:'.budget__expenses--value',
        percentagelabel:'.budget__expenses--percentage',
        expensesperclabel:'.item__percentage'
    }
    return{
        getinput:function(){
         return{
            type:document.querySelector(domstring.type).value,//either exp or income
            description: document.querySelector(domstring.description).value,
            value:parseFloat(document.querySelector(domstring.inputvalue).value)
        };
    },
        addListItem: function(obj,type){
            var element , html, newhtml;
            //1.create html string with placeholder text
            if(type==='exp'){
                element=domstring.expensecontainer;
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                
            }else if(type==='inc'){
                  element=domstring.incomecontainer;
        html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            
            //2.replace the placeholder text with some actual; data
        newhtml=html.replace('%id%',obj.id);
                newhtml=newhtml.replace('%description%',obj.description);
                newhtml=newhtml.replace('%value%',obj.value);
            
            //3.insert the html into the dom
document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);//before end is the postion to place the html code in webpage we will further learn about it while learning html language
        
        },
        clearfields:function(){
        var fields,fieldsarray;
            fields=document.querySelectorAll(domstring.description +","+ domstring.inputvalue);//queryselectorall return list of arguments we just passed in it
        fieldsarray=Array.prototype.slice.call(fields);
        fieldsarray.forEach(function(current,index,array){
            current.value="";
        });
fieldsarray[0].focus();
        },
        

        displaybudget: function(obj){
  document.querySelector(domstring.budgetlabel).textContent=obj.budget;
document.querySelector(domstring.incomelabel).textContent=obj.totalinc;
document.querySelector(domstring.expenseslabel).textContent=obj.totalexp;
   if(obj.percnt >0){
         document.querySelector(domstring.percentagelabel).textContent=obj.percnt +'%';   
   }else{
            document.querySelector(domstring.percentagelabel).textContent='---';
   }
       
  console.log(obj);
            console.log(obj.percnt);
            //if(obj.percnt > 0){
     
    //}else{
      //  document.querySelector(domstring.percentagelabel).textContent='---';
//    }
    

},
        deletelistitem:function(fullid){
          var el=document.getElementById(fullid);
            el.parentNode.removeChild(el);
        },
        
        displaypercentages:function(percentages){
        var perclist=document.querySelectorAll(domstring.expensesperclabel);
            console.log(perclist);
            
            var nodelistforeach=function(list,callback){
               for(var i=0; i<list.length; i++) {
                  callback(list[i],i);
                   
               //    list[i].textContent=percentages[i] +'%' --- this is my way this is also working.
               }
            
            }
            
            
            nodelistforeach(perclist,function(current,index){
              if(percentages[index] >0){
              current.textContent=percentages[index] + '%'    
              }else{
                  current.textContent='---';
              }
                
            });
        },

        
        getdomstring:function(){
        return domstring;
    }
    };
})();

////Controller moduel
var Controller=(function(budgetctrl,Uictrl){
    
    var setupeventlistener=function(){
    var domstringctrl=Uictrl.getdomstring();
        document.querySelector(domstringctrl.mouse).addEventListener('click',ctrladditem);
    
    document.addEventListener('keypress',function(event){//here we dont use queryselector because keypres event takes place on full web page and not on specfic element of html and function can take argument which is event argument
        if(event.keyCode===13 || event.which===13){
            ctrladditem();
        }
    });
    
        document.querySelector(domstringctrl.container).addEventListener('click',ctrldeleteitem);
    
    
    };
    
    var updatebudget=function(){
        //1.calculate the budget
        budgetctrl.calculatebudget();
        //2.return the budget/
var finalbudget=budgetctrl.returnbudget();
        //3.display the budget on the ui
    Uictrl.displaybudget(finalbudget);
    }
    
    var ctrladditem=function(){
        //herethe main code 
    //1.get the input data
        var input=Uictrl.getinput();
if(input.description!=="" && !isNaN(input.value) && input.value >0){
       //2.add the item to budget controller
    var item=budgetctrl.additem(input.type,input.description,input.value);    
    
        
        //3.addthe item to ui
        Uictrl.addListItem(item,input.type);
    
        //4.clear the fields
    Uictrl.clearfields();
    //5, calculate and update the budget
    updatebudget();
    //6.calculating and displaying percentages
calculatepercentages();
}
        
     
    };
    
    var calculatepercentages=function(){
      //1.calculate percentages
        budgetctrl.calculatepercnt();
        
        //2.read percentages 
    var prcntarray=budgetctrl.getpercent();
        
        //3.update UI from new percentages
    Uictrl.displaypercentages(prcntarray);
    };
    
    
    
    var ctrldeleteitem=function(event){
      var itemid, splitid, type, ID;
itemid= event.target.parentNode.parentNode.parentNode.parentNode.id;//this is called dom traversing..in which we traverse back to parentnodes of elements to access them,h
        if(itemid){
        splitid=itemid.split('-');
        ID=parseInt(splitid[1]);//we are using parse int because id present in HTML is in string format
        type=splitid[0];
            console.log(ID,type);
//1.deletethe item from budget datastructure
budgetctrl.deleteitem(type,ID);
        
        //2.delete the item from UI
        
        Uictrl.deletelistitem(itemid);
        //update ad show the new budget
            updatebudget();
        }
        
    };
   
   
    
return{
    init:function(){
        setupeventlistener();
Uictrl.displaybudget({
    budget:0,
    totalinc:0,
    totalexp:0,
    percnt:-1
    
});
    console.log("application has started");
}
};
})(Budgetcontroller,UIcontroller);//in that way wecan connects modules to each other.

Controller.init();