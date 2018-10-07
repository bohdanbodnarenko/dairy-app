import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../../services/item-service/items.service';
import { element } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent implements OnInit {
 itemsArr:any[];
 selectedItem:any;
 selectedItemArrComments:any[];
  constructor(private itemsService:ItemsService) { }

  ngOnInit() {
    this.itemsService.getItemsList().snapshotChanges()
    .subscribe(item =>{
      this.itemsArr = [];
      item.forEach(element =>{
        let tmp:any;
        tmp = element.payload.toJSON();
        tmp.key = element.key;        
        this.itemsArr.push(tmp);
      })
    });

    document.getElementById('addItem').addEventListener('keydown',e=>{
      if (e.keyCode===13) {
        document.getElementById('addItem').click();
    }});
  }

  addItem(itemTitle:any){
    this.itemsService.addItem(itemTitle.value);
    itemTitle.value = null;
  }

  onDelete(item:any){
    console.log(item);    
    try{
      if(item.key === this.selectedItem.key){
      this.selectedItem=null;
      console.log(1);
    }
    }catch(e){
      console.log(e.message);
      
    }
    
    this.itemsService.removeItem(item.key);
    if(this.itemsArr.length===1){
      this.itemsService.setSelectedItem(null);
    };
  }

  onSelectItem(item:any){
    this.itemsService.setSelectedItem(item);
    this.selectedItem = item;
    this.selectedItemArrComments = [];
    for(let key in this.itemsService.getSelectedItem().comments){
      this.selectedItemArrComments[key] = this.itemsService.getSelectedItem().comments[key];
    }
    this.itemsService.updateItem(item,'comments',this.selectedItemArrComments);
  }
  
  addComment(comment:any){
    this.itemsService.addComment(comment.value);
    comment.value = null;
    this.selectedItem = this.itemsService.getSelectedItem();
    this.selectedItemArrComments=this.selectedItem.comments;
    console.log(this.selectedItem);
    
    }

    deleteComment(comment){
      console.log(comment);
      
      this.itemsService.deleteComment(comment);
      this.selectedItem = this.itemsService.getSelectedItem();
      this.selectedItemArrComments=this.selectedItem.comments;
    }
}
