export class CardConstants {
    public cardRatio = 88/63
    public width = 720;
    public height = this.width*this.cardRatio;
    public cardCount = 69; //tts can do a max of 69 per sheet, including back image
    public sheetSize = 70; //tts can do a max of 70 per sheet
    public padding = 0; //set to 0 for tts
    public cols = 10;
    public rows = Math.ceil(this.cardCount/this.sheetSize);
    public insideConst = this.width*.06;
    public boarderRadius = this.width * .05;
}