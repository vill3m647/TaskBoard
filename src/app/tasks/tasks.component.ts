import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormControl, FormGroup } from '@angular/forms';

import {AlertService, MainService} from '../_services';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  newTaskForm: FormGroup;
  newProd: FormGroup;

  constructor(public dialog: MatDialog, private mainService: MainService,
              private alertService: AlertService,    private router: Router,) {}

  todo = [];
  product = [];
  doing = [];
  done = [];
  rejected = [];

  ngOnInit() {

    this.newTaskForm = new FormGroup({
      'name' : new FormControl(null),
      'desc' : new FormControl(null),
      'date' : new FormControl()
    })

    this.newProd = new FormGroup({
      'name' : new FormControl(null),
      'description' : new FormControl(null),
      'estimatedDelivery' : new FormControl()
    })

    let localtodo = localStorage.getItem('todo');
    if (localtodo) {
      this.todo = JSON.parse(localtodo);
    }

    let localdoing = localStorage.getItem('doing');
    if (localdoing) {
      this.doing = JSON.parse(localdoing);
    }

    let localdone = localStorage.getItem('done');
    if (localdone) {
      this.done = JSON.parse(localdone);
    }

    let localrejected = localStorage.getItem('rejected');
    if (localrejected) {
      this.rejected = JSON.parse(localrejected);
    }
  }

  addTask() {
    this.newTaskForm.value.date = new Date()

    this.todo.push(this.newTaskForm.value);

    this.newTaskForm.reset()
    localStorage.setItem('todo', JSON.stringify(this.todo));
    this.newTaskForm.value.date = new Date();
  }

  addProd() {
    this.newProd.value.date = new Date()

    this.product.push(this.newProd.value);



    localStorage.setItem('prod', JSON.stringify(this.product));
    this.newProd.value.estimatedDelivery = new Date();
    this.mainService.addProduct(this.newProd.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Added new Product', true);
        },
        error => {
          console.log(error)
          this.alertService.error(error.error);
        });
    this.newProd.reset()
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    localStorage.setItem('todo', JSON.stringify(this.todo));
    localStorage.setItem('doing', JSON.stringify(this.doing));
    localStorage.setItem('done', JSON.stringify(this.done));
    localStorage.setItem('rejected', JSON.stringify(this.rejected));
  }


  deleteTask(date, type){
    switch (type) {
      case 'todo':
        this.todo = this.todo.filter((item) => item.date !== date)
        localStorage.setItem('todo', JSON.stringify(this.todo));
      break;

      case 'doing':
        this.doing = this.doing.filter((item) => item.date !== date)
        localStorage.setItem('doing', JSON.stringify(this.doing));
      break;

      case 'done':
        this.done = this.done.filter((item) => item.date !== date)
        localStorage.setItem('done', JSON.stringify(this.done));
      break;

      case 'rejected':
        this.rejected = this.rejected.filter((item) => item.date !== date)
        localStorage.setItem('rejected', JSON.stringify(this.rejected));
      break;

      default:
        break;
    }
  }
}
