import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import { productType } from './productType'
import { salesType } from './salesType'
import { orderType } from './orderType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, productType, salesType, orderType],
}
