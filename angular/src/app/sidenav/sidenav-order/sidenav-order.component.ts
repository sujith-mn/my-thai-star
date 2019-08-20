import { WindowService } from 'app/core/window/window.service';
import { SidenavService } from '../shared/sidenav.service';
import { PriceCalculatorService } from '../shared/price-calculator.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { Component, OnInit, Input } from '@angular/core';
import { OrderView } from '../../shared/view-models/interfaces';
import { map } from 'lodash';
import { CommentAlertComponent } from '../comment-alert/comment-alert.component';

@Component({
  selector: 'public-sidenav-order',
  templateUrl: './sidenav-order.component.html',
  styleUrls: ['./sidenav-order.component.scss'],
})
export class SidenavOrderComponent implements OnInit {
  extras: string;
  @Input() order: OrderView;

  constructor(
    public window: WindowService,
    private sidenav: SidenavService,
    public dialog: MatDialog,
    private calculator: PriceCalculatorService,
  ) {}

  ngOnInit(): void {
    this.extras = map(this.order.extras, 'name').join(', ');
  }

  removeComment(): void {
    this.order.orderLine.comment = undefined;
  }

  addComment(): void {
    const dialogRef: MatDialogRef<CommentDialogComponent> = this.dialog.open(
      CommentDialogComponent,
    );
    dialogRef.afterClosed().subscribe((content: string) => {
      this.order.orderLine.comment = content;
    });
  }

  increaseOrder(): void {
    this.sidenav.increaseOrder(this.order);
  }

  decreaseOrder(): void {
    this.sidenav.decreaseOrder(this.order);
  }

  removeOrder(): void {
    this.sidenav.removeOrder(this.order);
  }

  calculateOrderPrice(): number {
    return this.calculator.getPrice(this.order);
  }

  openCommentDialog(): void {
    this.dialog.open(CommentAlertComponent, {
      width: this.window.responsiveWidth(),
      data: this.order.orderLine.comment,
    });
  }
}
