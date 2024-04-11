export type SmartTableDesign = 'default' | 'bordered' | 'bordered-dashed' | 'striped';

export type SmartTableOptions = {
  design?: SmartTableDesign;

  wrapper?: Partial<{
    class: string;
    style: string | Record<string, string>;
    responsive: boolean;
  }>;

  table?: Partial<{
    class: string;
    style: string | Record<string, string>;
  }>;

  headers?: Partial<{
    show: boolean;
    showExpandTitle: boolean;

    textAlignment: 'start' | 'center' | 'end';

    // styling
    class: string;
    style: string | Record<string, string>;

    columnClass: string;
    columnStyle: string | Record<string, string>;
    resizable: boolean;
  }>;

  items?: Partial<{
    class: string;
    style: string | Record<string, string>;
    expandBackground: string;

    translate: boolean;
    textAlignment: 'start' | 'center' | 'end';
    columnClass: string;
    columnStyle: string | Record<string, string>;
  }>;

  noData?: Partial<{
    text: string;
    slot: string;
  }>;
}

export type SmartTableHeader = {
  title: string;
  subTitle?: string,
  field: string;

  // styling
  headerClass?: string;
  headerStyle?: string | Record<string, string>;
  cellClass?: string;
  cellStyle?: string | Record<string, string>;

  // custom slots
  slotName?: string;
  slotCellName?: string;

  // sorting
  sortable?: boolean;

  // sub headers
  subHeaders?: Array<Omit<SmartTableHeader, 'subHeaders'>>;
}

export type ComputedSmartTableHeader = SmartTableHeader & {
  rowSpan: number;
  colSpan: number;

  startTopRadius?: boolean;
  startBottomRadius?: boolean;
  endTopRadius?: boolean;
  endBottomRadius?: boolean;
  borderStart? : boolean;
}

export type SmartTableItem = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  oneLineSlotItem?: string;
  nestedItems?: Array<SmartTableItem>;
}

export type SmartTableSortField = null | {
  field: string;
  direction: 'asc' | 'desc';
}
