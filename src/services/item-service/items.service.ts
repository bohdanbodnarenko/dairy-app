import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Item } from '../../app/models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private itemsList: AngularFireList<any>;
  private selectedItem:any;

  getSelectedItem(){
    return this.selectedItem;
  }

  setSelectedItem(item:any){
    this.selectedItem = item;
  }

  constructor(private firebasedb: AngularFireDatabase) { }

  getItemsList(){
    this.itemsList = this.firebasedb.list('titles');
    return this.itemsList;
  }

  addItem(title:string){
    if(title!==''){
    let tmp = new Item();
    tmp.title = title;
    tmp.comments = [];
    this.itemsList.push(tmp);
  }}

  removeItem(key:string){
    this.itemsList.remove(key);
  }
  addComment(comment:string){
    if(comment===''||comment===null){
      return;
    }
    
    let tmp = {
      title:this.selectedItem.title,
      key:this.selectedItem.key,
      comments:new Array()
    };
    let tmpArr = new Array();
    if (this.selectedItem.comments) {
      for (let key in this.selectedItem.comments) {
        tmpArr.push(this.selectedItem.comments[key]);
      }
    }
    tmp.comments = tmpArr;
    tmp.comments.push(comment);    
    this.selectedItem = tmp;
    this.itemsList.update(this.selectedItem.key,tmp);
  }
  
  updateItem(item:any,key:string,value:any){
    let obj = item;
    obj[key] = value;
    this.itemsList.update(item.key,obj);
    this.itemsList.query
  }
  deleteComment(comment){
        let tmpComments = this.selectedItem.comments.filter(elem => {if (this.selectedItem.comments.indexOf(elem)!==comment)return elem});
        this.updateItem(this.selectedItem,'comments',tmpComments);
      }
}
