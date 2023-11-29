import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ma-strength-meter',
  exportAs: 'strengthMeter',
  templateUrl: './strength-meter.component.html',
  styleUrls: ['./strength-meter.component.less'],
  standalone: true
})
export class StrengthMeterComponent implements OnInit {
  @Input() score: ScoreLevel = null;
  @Input() set password(pwd: string) {
    this.score = this.getScore(pwd);
  }

  constructor() {}

  ngOnInit(): void {}

  /**
   * 获取密码强度
   * @param value
   */
  getScore(value: string): ScoreLevel {
    if (!value) {
      return null;
    }

    // 0： 表示第一个级别 1：表示第二个级别 2：表示第三个级别
    // 3： 表示第四个级别 4：表示第五个级别
    let score: ScoreLevel = 0;
    if (value.length < 6) {
      // 最初级别
      return score;
    }

    // 如果用户输入的密码 包含了数字
    if (/\d/.test(value)) {
      score++;
    }

    // 如果用户输入的密码 包含了小写的a到z
    if (/[a-z]/.test(value)) {
      score++;
    }

    // 如果用户输入的密码 包含了大写的A到Z
    if (/[A-Z]/.test(value)) {
      score++;
    }

    // 如果是非数字 字母 下划线
    if (/\W/.test(value)) {
      score++;
    }

    return score as ScoreLevel;
  }
}

export type ScoreLevel = null | 0 | 1 | 2 | 3 | 4;
