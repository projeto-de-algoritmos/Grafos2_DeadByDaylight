import { Component, OnInit } from '@angular/core';
import { LinkedList } from '../lista';
import { HostListener } from '@angular/core';

interface Arestas {
  de: number;
  para: number;
}
interface Casa {
  l: number;
  c: number;
}
interface Palets {
  casa: Casa,
  aberta: boolean
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  listas: LinkedList<number>[] = [];

  white: Casa[] = [];
  windows: Casa[] = [
    {l:3,c:8},
    {l:4,c:19},
    {l:8,c:17},
    {l:10,c:15},
    {l:12,c:5},
    {l:18,c:15},
    {l:22,c:9},
  ];
  generators: Casa[] = [
    {l:3,c:3},
    {l:3,c:25},
    {l:16,c:16},
    {l:22,c:2},
    {l:28,c:25}
  ];
  palets: Palets[] = [
    {casa: {l:2,c:21}, aberta: true},
    {casa: {l:6,c:25}, aberta: true},
    {casa: {l:11,c:18}, aberta: true},
    {casa: {l:12,c:1}, aberta: true},
    {casa: {l:12,c:27}, aberta: true},
    {casa: {l:15,c:19}, aberta: true},
    {casa: {l:17,c:10}, aberta: true},
    {casa: {l:18,c:24}, aberta: true},
    {casa: {l:20,c:1}, aberta: true},
  ];
  start: Casa[] = [
    {l:5,c:5},
    {l:5,c:23},
    {l:23,c:5},
    {l:23,c:23},
  ]
  generatorsProgress = [0,0,0,0,0];

  playerPosition: Casa = {} as Casa;
  isPlayer: boolean = false;
  killerPosition: Casa = {} as Casa;
  isKiller: boolean = false;
  direcao: string = 'L';

  key: any;
  lastTimeStamp:number = 0;

  constructor() { }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    let key = event.key;
    if(event.timeStamp-this.lastTimeStamp>200){
      this.lastTimeStamp = event.timeStamp;
      
      if(this.hasPalet()!='emCima'){
        if(key=='w'){
          this.direcao='N';
        }
        if(key=='a'){
          this.direcao='O';
        }
        if(key=='s'){
          this.direcao='S';
        }
        if(key=='d'){
          this.direcao='L';
        }
      }
    }

    if(key=='e'){
      this.acao();
    }
  }

  ngOnInit(): void {
    this.mapInit();
    this.startPositions();
    if(this.playerPosition.l==5) this.direcao = "L";
    else this.direcao = "N";
    this.survivorMoviment();
  }

  acao(){
    let palet = this.hasPalet();
    let generator = this.hasGenerator();

    if(palet){
      this.palets.forEach(p=>{
        if(p==palet) p.aberta = false;
      })
    }
    if(generator){
      this.generators.forEach((g, i)=>{
        if(g==generator) this.generatorProgress(i);
        
      })
    }
    
  }

  hasPalet():any{
    let mesmaLinha = this.palets.filter(a=>a.aberta==true).filter(a=>a.casa.l==this.playerPosition.l).find(a=>
      a.casa.c == this.playerPosition.c-1 || a.casa.c == this.playerPosition.c+1);
    let mesmaColuna = this.palets.filter(a=>a.aberta==true).filter(a=>a.casa.c==this.playerPosition.c).find(a=>
      a.casa.l == this.playerPosition.l-1 || a.casa.l == this.playerPosition.l+1);

    let emCima = this.palets.filter(a=>a.aberta==false).filter(a=>a.casa.l==this.playerPosition.l).find(a=>
      a.casa.c == this.playerPosition.c || a.casa.c == this.playerPosition.c);

    if(mesmaLinha !== undefined) return mesmaLinha;
    else if (mesmaColuna !== undefined) return mesmaColuna;
    else if (emCima) return 'emCima';
      
    return false;
  }

  hasGenerator():any{
    let mesmaLinha = this.generators.filter(a=>a.l==this.playerPosition.l).find(a=>
      a.c==this.playerPosition.c-1 || a.c==this.playerPosition.c+1);
    let mesmaColuna = this.generators.filter(a=>a.c==this.playerPosition.c).find(a=>
      a.l==this.playerPosition.l-1 || a.l==this.playerPosition.l+1);

    if(mesmaLinha !== undefined) return mesmaLinha;
    else if (mesmaColuna !== undefined) return mesmaColuna;

    return false;
  }

  generatorProgress(generator:any){
    setTimeout(()=>{
      if(this.hasGenerator()){
        if(this.generatorsProgress[generator]<10)
          this.generatorsProgress[generator]++;
        if(this.generatorsProgress[generator]==10) this.completeGenerator(generator);
        this.generatorProgress(generator);
      }
    }, 1000);
    if(this.generatorsProgress.filter(a=>a==10).length==5){
      this.white.push({l:28,c:15})
    }
  }

  completeGenerator(generator:any){
    
  }

  survivorMoviment(){

    setTimeout(()=>{
      if(this.direcao=='L'){
        if(this.hasPosition(this.white, this.playerPosition.l, this.playerPosition.c+1))
          this.playerPosition.c++;
        else if(this.hasPosition(this.windows, this.playerPosition.l, this.playerPosition.c+1))
          this.playerPosition.c++;
        
      }
      if(this.direcao=='O'){
        if(this.hasPosition(this.white, this.playerPosition.l, this.playerPosition.c-1))
          this.playerPosition.c--;
        else if(this.hasPosition(this.windows, this.playerPosition.l, this.playerPosition.c-1))
          this.playerPosition.c--;
        
      }
      if(this.direcao=='N'){
        if(this.hasPosition(this.white, this.playerPosition.l-1, this.playerPosition.c))
          this.playerPosition.l--;
        else if(this.hasPosition(this.windows, this.playerPosition.l-1, this.playerPosition.c))
          this.playerPosition.l--;
        
      }
      if(this.direcao=='S'){
        if(this.hasPosition(this.white, this.playerPosition.l+1, this.playerPosition.c))
          this.playerPosition.l++;
        else if(this.hasPosition(this.windows, this.playerPosition.l+1, this.playerPosition.c))
          this.playerPosition.l++;
        
      }
      this.survivorMoviment();
    }, 250);
  }

  hasPosition(array: Casa[], l:number, c:number):boolean {
    if(array.find(a=>a.l==l && a.c==c)!== undefined)
      return true
    return false
  }

  hasCharacter(l:number, c: number): boolean{
    if(this.playerPosition.l==l && this.playerPosition.c==c){
      this.isPlayer = true;
      this.isKiller = false;
      return true;
    };
    if(this.killerPosition.l==l && this.killerPosition.c==c){
      this.isPlayer = false;
      this.isKiller = true;
      return true;
    };
    this.isPlayer = false;
    this.isKiller = false;
    return false;
  }

  startPositions(){
    let index = Math.floor(Math.random() * 4)
    this.playerPosition = this.start[index]

    if(this.playerPosition.l == 5) this.killerPosition.l = 23;
    else this.killerPosition.l = 5;
    if(this.playerPosition.c == 5) this.killerPosition.c = 23;
    else this.killerPosition.c = 5;
  }

  getColor(l:number, c: number){

    if(this.palets.find(a=>a.casa.l==l && a.casa.c==c)!== undefined){
      if(this.palets.find(a=>a.casa.l==l && a.casa.c==c)?.aberta == true)
        return 'bg-red-300';
      else 
        return 'bg-red-500';
    }

    if(this.white.find(a=>a.l==l && a.c==c)!== undefined)
      return 'bg-white'

    if(this.windows.find(a=>a.l==l && a.c==c)!== undefined)
      return 'bg-blue-500'
    
    if(this.generators.find(a=>a.l==l && a.c==c)!== undefined){
      let generator = this.generators.find(a=>a.l==l && a.c==c)!;
      if(this.generatorsProgress[this.generators.indexOf(generator)]==10)
        return 'bg-gray-500'
      else 
        return 'bg-yellow-500'
    }

    if(l==28 && c==15){
      return 'bg-green-500'
    }

    return 'bg-black';
  }

  mapInit(){
    let coluna = [];
    for(let i=1; i<28; i++){
      if(i!=8 && i!=14 && i!=22)
        this.white.push({l:1,c:i})
    }
    coluna = [1,5,9,13,17,21,23,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:2,c:i})
    }
    coluna = [1,4,5,6,7,9,11,12,13,14,15,16,17,19,20,21,22,23,24,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:3,c:i})
    }
    coluna = [1,9,15,17,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:4,c:i})
    }
    coluna = [1,2,3,4,5,6,7,8,9,11,12,13,15,17,18,19,20,21,22,23,24,25,26,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:5,c:i})
    }
    coluna = [1,3,7,11,15,23,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:6,c:i})
    }
    coluna = [1,3,5,6,7,8,9,10,11,12,13,14,15,16,17,19,20,21,22,23,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:7,c:i})
    }
    coluna = [1,3,5,7,19,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:8,c:i})
    }
    coluna = [1,3,5,7,9,10,11,12,13,14,15,17,18,19,21,22,23,24,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:9,c:i})
    }
    coluna = [1,3,5,7,9,19,21,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:10,c:i})
    }
    coluna = [1,3,5,7,9,11,12,13,14,15,16,17,18,19,20,21,23,24,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:11,c:i})
    }
    coluna = [1,3,7,9,11,17,19,21,23,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:12,c:i})
    }
    coluna = [1,3,4,5,7,9,11,17,19,21,23,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:13,c:i})
    }
    coluna = [1,3,5,7,9,11,17,19,21,22,23,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:14,c:i})
    }
    coluna = [1,3,5,7,9,11,17,19,21,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:15,c:i})
    }
    coluna = [1,3,5,7,9,11,17,19,21,22,23,24,25,26,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:16,c:i})
    }
    coluna = [1,3,4,5,6,7,9,10,11,12,13,14,15,16,17,19,21,23,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:17,c:i})
    }
    coluna = [1,5,9,19,21,23,24,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:18,c:i})
    }
    coluna = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,23,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:19,c:i})
    }
    coluna = [1,13,21,23,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:20,c:i})
    }
    coluna = [1,2,3,5,6,7,8,9,10,11,13,14,15,17,18,19,20,21,23,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:21,c:i})
    }
    coluna = [3,5,11,13,15,17,23,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:22,c:i})
    }
    coluna = [1,2,3,5,7,8,9,11,12,13,15,17,18,19,20,21,23,25,26,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:23,c:i})
    }
    coluna = [1,3,5,7,9,15,21,23,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:24,c:i})
    }
    coluna = [1,3,4,5,7,9,10,11,12,13,15,17,18,19,20,21,23,24,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:25,c:i})
    }
    coluna = [1,7,11,15,17,25,27]
    for(let i=1; i<28; i++){
      if(coluna.includes(i))
        this.white.push({l:26,c:i})
    }
    for(let i=1; i<28; i++){
      this.white.push({l:27,c:i})
    }
  }
}
