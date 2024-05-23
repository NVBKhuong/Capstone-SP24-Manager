interface Species{
    "id": string,
    "thumbnailUrl": number,
    "name": string,
    "createAt": string
}
interface CareMode{
    "id": string,
    "priority": number,
    "name": string,
    "createAt": string
}
interface Area{
    "id": string,
    "thumbnailUrl": number,
    "name": string,
    "createAt": string
}
export interface Cage{
        "id": string,
        "code": string,
        "name": string,
        "material": string,
        "description": string,
        "height": number,
        "width": number,
        "depth": number,
        "thumbnailUrl": string,
        "careMode": CareMode,
        "species": Species,
        "area": Area,
        "createAt": string
    }