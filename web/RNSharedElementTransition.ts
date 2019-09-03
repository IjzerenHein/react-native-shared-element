import { RNSharedElementTransitionItemType } from './types';
import { RNSharedElementTransitionItem } from './RNSharedElementTransitionItem';
import { RNSharedElementNode } from './RNSharedElementNode';
import { RNSharedElementNodeManager } from './RNSharedElementNodeManager';

export class RNSharedElementTransition {
    private items: RNSharedElementTransitionItem[];
    
    constructor(nodeManager: RNSharedElementNodeManager) {
        this.items = [
            new RNSharedElementTransitionItem(nodeManager, 'start'),
            new RNSharedElementTransitionItem(nodeManager, 'end'),
        ]
    }

    setItemNode(itemType: RNSharedElementTransitionItemType, node: RNSharedElementNode) {
        this.items[itemType].node = node;
    }


}