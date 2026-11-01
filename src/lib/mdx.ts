import {asset} from './paths';
type Node={type?:string;children?:Node[];attributes?:{name?:string;value?:unknown}[]};
// MDX JSX uses literal DOM elements; prefix local src/href values in its AST.
export function prefixMdxAssets(){return(tree:unknown)=>{
 const visit=(node:Node)=>{if(node.type==='mdxJsxFlowElement'||node.type==='mdxJsxTextElement')for(const attribute of node.attributes??[])if((attribute.name==='src'||attribute.name==='href')&&typeof attribute.value==='string')attribute.value=asset(attribute.value);node.children?.forEach(visit);};
 visit(tree as Node);
};}
