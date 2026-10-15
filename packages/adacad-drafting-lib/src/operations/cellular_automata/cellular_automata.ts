//TODO: check and resolve unecessary dependencies at the end - for now, just import the ones listed in the sample operation documentation
import { initDraftFromDrawdown, initDraftWithParams, wefts, warps, createCell, updateWeftSystemsAndShuttles, updateWarpSystemsAndShuttles, Drawdown, getCellValue } from "../../draft";
import { getOpParamValById, getInputDraft, getAllDraftsAtInlet, parseDraftNames, flattenParamVals} from "../../operations";
import { transformationOp } from "../categories";
import { OperationParam, OperationInlet, OpParamVal, OpInput, Operation, OpMeta, NumParam, SelectParam, StringParam } from "../types";
import { Sequence } from "../../sequence";


const name = "cellular_automata";

const meta: OpMeta = {
  displayname: 'cellular automata', 
  advanced: true, 
  categories: [transformationOp], 
  desc: "Alters a draft by applying a cellular automata rule each time-step.", 
  authors: ['Gabrielle Partch', 'Deanna Gelosi'] 
}

// DEFINE PARAMETERS
const timestep:NumParam = {
    name: 'timestep',
    type: 'number',
    min: 0,
    max: 20, // TODO: test to find a realistic max value later - for now use 20 as a placeholder
    value: 1,
    dx: "the number of times the cellular automata rule is applied. Each iteration is applied to the previous automata state."
}

// TODO: ask about the hardcoded increment step of 1 in parameter.component.html - projects\ui\src\app\mixer\palette\operation\parameter\parameter.component.html
// const increment:NumParam = {
//     name: 'timestep increment',
//     type: 'number',
//     min: 1,
//     max: 100, // TODO: test to find a realistic max value later - for now use 100 as a placeholder
//     value: 1,
//     dx: "the increment that the timestep will increase or decrease by. Alternively, you can enter an exact timestep value."
// }

//TODO: figure out how to do the conditional part for the custom dropdown setting. For now, just use the custom text box and enter a wolfram code directly
// const ruleset:SelectParam = {
//     name: 'ruleset',
//     type: 'select',
//     selectlist: [
//         { name: "Conway's Game of Life", value: 0 }, //B3/S23
//         { name: '34 Life', value: 1 }, //B34/S34
//         { name: 'Amoeba', value: 2 }, //B357/S1358
//         { name: 'Life Without Death', value: 3 }, //B12345678/S3
//         { name: 'custom', value: 4 }
//     ],
//     value: 0,
//     dx: "the rule that determines how the next generation is calculated at each timestep."
// }

const wrapping:SelectParam = {
    name: 'ruleset',
    type: 'select',
    selectlist: [
        { name: 'wrapped', value: 0 },
        { name: 'fixed live', value: 1 }, 
        { name: 'fixed dead', value: 2 }
    ],
    value: 0,
    dx: "determines what value is used for cells that are outside the draft, the edge-cases, when calculating an iteration."
}

const custom_ruleset:StringParam =
{
  name: 'custom',
  type: 'string',
  regex: /^B[0-8]*\/S[0-8]*$/i,
  value: 'B3/S23',
  error: 'rules must be in wolfram code format',
  dx: 'define a custom ruleset' //TODO: come up with better description later
};

const params: Array<OperationParam> = [timestep, custom_ruleset];

// DEFINE INLETS
const draft_inlet: OperationInlet = {
  name: 'input draft',  //a name to display on this inlet
  type: 'static',       //pre-defined inlets will always be 'static'.
  value: null,          //if you need to access a value or identifier with this inlet, specify that here, will mostly be null
  uses: "draft",       //describes what element of the draft this operation will use. Some operations only use materials information
  dx: 'the draft you would like to transform', //a description to display on this inlet
  num_drafts: 1 // the maximum number of drafts this inlet can accept. Use -1 for no limit
}

const inlets = [draft_inlet]; //push all the parameters to an array called params.


// Parses the ruleset and returns the corresponding lookup tables to check against when calculating the next generation
const parseRule = (rulestring: string): { born: Uint8Array; survive: Uint8Array } => {
    // Capture the string of born numbers and the string of survive numbers, returning null if there are no born/survive numbers to be found
    const match = /^B([0-8]*)\/S([0-8]*)$/i.exec(rulestring);
    if (!match) throw new Error(`Invalid rulestring: ${rulestring}`);

    // Create a quick lookup table for born/survive cell numbers with 9 values (not 8 to account for zero born/survive numbers as well)
    const born: Uint8Array = new Uint8Array(9)
    const survive: Uint8Array = new Uint8Array(9)

    // Set the corresponding indices of born/survive array values that are listed in the rule to true (using the value 1 for true, slightly more efficient than a bool array supposedly)
    for(const digit of match[1]) {
        born[Number(digit)] = 1;
    }
    for(const digit of match[2]) {
        survive[Number(digit)] = 1;
    }

    return {born, survive};
}

const sumNbrhood = (nbrhood: Drawdown, idx: number[]): number => {
    //for()
}

// Applies the rule for a single iteration of the automata
const nextGeneration = (current_state: Drawdown, born: Uint8Array, survive: Uint8Array): Drawdown => {
    // const next_state: Drawdown = [];
    // const width = warps(current_state);
    // const height = wefts(current_state);

    /**
     * 1. Iterate through grid of cells left to right, top to bottom
     * 2. 
     */

    
    // return next_state;
}

const perform = (param_vals: Array<OpParamVal>, op_inputs: Array<OpInput>) => {
    // The timestep/ number of iterations that have elapsed
    const tstep: number = <number>getOpParamValById(0, param_vals); 
    // The rule that is being applied at each timestep
    const rule: string = <string>getOpParamValById(0, param_vals);
    const draft = getInputDraft(op_inputs);
    // Lookup tables for born/survive values based on the ruleset
    const {born, survive} = parseRule(rule);

    // Calculate the 
}

const generateName = (param_vals: Array<OpParamVal>, op_inputs: Array<OpInput>) : string => {
    return 'cellular_automata(' + flattenParamVals(param_vals) + ")";
}

const sizeCheck = (param_vals: Array<OpParamVal>): boolean => {
    return true;
}

export const cellular_automata: Operation = { name, meta, params, inlets, perform, generateName, sizeCheck };
