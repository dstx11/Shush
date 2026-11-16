/** Bounded resource loading shared by the two PNG renderers. */
export function within<T>(resource:Promise<T>,milliseconds:number):Promise<T>{
 return new Promise((resolve,reject)=>{
  const timer=window.setTimeout(()=>reject(new Error()),milliseconds);
  resource.then(value=>{clearTimeout(timer);resolve(value);},error=>{clearTimeout(timer);reject(error);});
 });
}
export async function loadCanvasImage(source:string){
 const image=new Image();image.src=source;await within(image.decode(),8000);return image;
}
