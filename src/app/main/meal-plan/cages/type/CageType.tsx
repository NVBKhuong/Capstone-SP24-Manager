export type CageType = {
    id:string,
    code:string,
    name:string,
    material:string,
    description:string,
    height:number,
    width:number,
    depth:number,
    thumbnailUrl:string,
    caremode:{
        id:string,
        proirity:string,
        name:string,
        createAt:string,
    },
    species:{
        id:string,
        thumbnailUrl:string,
        name:string,
        createAt:string,
    },
    area:{
        id:string,
        thumbnailUrl:string,
        name:string,
        createAt:string,
    },
    createAt:string,


}
export type CagesType = 
{
    data :CageType[],
    pagination:{}

};