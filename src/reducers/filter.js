/////////////////////
// ACTION CREATORS //
/////////////////////

export function setFilter(filter) {
  return {
    type: 'SET_FILTER',
    filter
  };
}

export function resetAllFilters(groupKey, tagKey) {
  return {
    type: 'RESET_ALL_FILTERS',
    groupKey,
    tagKey
  };
}

export function resetOneFilter(groupKey, tagKey) {
  return {
    type: 'RESET_ONE_FILTER',
    groupKey,
    tagKey
  };
}

export function filterChecked(groupKey, tagKey) {
  return {
    type: 'FILTER_CHECKED',
    groupKey,
    tagKey
  };
}


/////////////
// REDUCER //
/////////////

const INITIAL_STATE = {
  /*
    filter: {
      language: {
        nb: true,
        nn: true,
        en: false
      },
      topic: {
        app: true,
        cryptography: false,
        electronics: false,
        block_based: false,
        step_based: false,
        text_based: false,
        minecraft: false,
        web: false,
        game: true,
        robot: false,
        animation: false,
        sound: false,
      },
      subject: {
        mathematics: false,
        science: false,
        programming: true,
        technology: false,
        music: false,
        norwegian: false,
        english: false,
        arts_and_crafts: true,
        social_science: false,
      },
      grade: {
        preschool: false,
        primary: false,
        secondary: true,
        junior: false,
        senior: false,
     },
    }
  */
};

function handleCheckFilter(state, groupKey, tagKey){
  if(groupKey == null || tagKey == null) return state;

  // Check if state contains the filterItem that was checked
  // This should always be false, but it's better to be safe than sorry
  if(!Object.prototype.hasOwnProperty.call(state, groupKey) ||
    !Object.prototype.hasOwnProperty.call(state[groupKey], tagKey)
  ) {
    return state;
  }

  // Create next state
  const checked = state[groupKey][tagKey];
  return {
    ...state,
    [groupKey]: {
      ...state[groupKey],
      [tagKey]: !checked
    }
  };

}

// Returns a copy of filterGroup where all values have been set to false
// except the tagKeys matching trueTagKey
const resetFilterGroup = (filterGroup, trueTagKey) => {
  const reducerAddTagAsFalse = (result, tagKey) => ({...result, [tagKey]: tagKey === trueTagKey});
  const tagKeys = Object.keys(filterGroup);
  return tagKeys.reduce(reducerAddTagAsFalse, {});
};

// Set all tags to false except filter[groupKey][trueTagKey]
function handleResetAllFilters(state, groupKey, trueTagKey) {
  const reducerAddGroup = (result, gKey) => ({
    ...result,
    [gKey]: resetFilterGroup(state[gKey], gKey === groupKey ? trueTagKey : null)
  });
  const groupKeys = Object.keys(state);
  return groupKeys.reduce(reducerAddGroup, {});
}

// Set all tags to false in group with groupKey except filter[groupKey][trueTagKey]
function handleResetOneFilter(state, groupKey, trueTagKey) {
  const groupKeys = Object.keys(state);
  const validGroupKey = groupKeys.includes(groupKey);
  return validGroupKey ? {...state, [groupKey]: resetFilterGroup(state[groupKey], trueTagKey)} : state;
}

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case 'SET_FILTER':
      return action.filter;
    case 'RESET_ALL_FILTERS':
      return handleResetAllFilters(state, action.groupKey, action.tagKey);
    case 'RESET_ONE_FILTER':
      return handleResetOneFilter(state, action.groupKey, action.tagKey);
    case 'FILTER_CHECKED':
      return handleCheckFilter(state, action.groupKey, action.tagKey);
  }
  return state;
}
