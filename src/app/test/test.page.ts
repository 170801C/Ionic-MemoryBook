import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute} from '@angular/Router';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  // itemId: string;

  constructor() {}

  // constructor(private thisRoute: ActivatedRoute) { }

  ngOnInit() {
    // this.itemId = this.thisRoute.snapshot.paramMap.get('id');
  }

}
