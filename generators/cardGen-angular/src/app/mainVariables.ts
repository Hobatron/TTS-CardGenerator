export class CardConstants {
  public cardRatio = 88 / 63; // this ratio seems off in tts, not sure why
  public width = 720;
  public height = this.width * this.cardRatio;
  public cardCount = 69;
  public sheetSize = 70;
  public padding = 0; //set to 0 for tts
  public cols = 10;
  public rows = Math.ceil(this.cardCount / this.sheetSize);
  public insideConst = this.width * 0.06;
  public boarderRadius = this.width * 0.05;
}
