import { Component, Input } from '@angular/core';

import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  @Input() posts: Post[] = [];
  // posts = [
  //   { title: 'First post', content: 'Sample' },
  //   { title: 'Seconds post', content: 'Sample' },
  //   { title: 'Third post', content: 'Sample' }
  // ];
}
