import 'antd/dist/antd.css'
// import '../styles/antdDark.less'
import {
  createGlobalStyle,
  GlobalStyleComponent,
  DefaultTheme
} from 'styled-components'
import reset from 'styled-reset'

const globalStyles: GlobalStyleComponent<{}, DefaultTheme> = createGlobalStyle`
    ${reset};
    body {
      .ant-menu {
        background: transparent;
        border-color: transparent;
      }
    }
    body.dark {
      color: rgba(255, 255, 255, 0.65);
      background-color: #30303d;
      .ant-layout {
        color: rgba(255, 255, 255, 0.65);
        background-color: #30303d;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: rgba(255, 255, 255, 0.85);
      }
      a {
        color: rgba(255, 255, 255, 0.65)
      }
      .ant-breadcrumb-separator {
          color: rgba(255, 255, 255, 0.45);
      }
      .ant-breadcrumb > span:last-child {
          color: rgba(255, 255, 255, 0.65);
      }
      .ant-card {
          color: rgba(255, 255, 255, 0.65);
          background: #23232e;
      }
      .ant-skeleton.ant-skeleton-active .ant-skeleton-content .ant-skeleton-title, .ant-skeleton.ant-skeleton-active .ant-skeleton-content .ant-skeleton-paragraph > li {
          background: linear-gradient(90deg, rgba(0, 0, 0, 0.8) 25%, rgba(0, 0, 0, 0.81) 37%, rgba(0, 0, 0, 0.8) 63%);
      }
      .ant-layout-sider-trigger {
        background: #002140;
        color: #fff;
      }
      .ant-menu {
        color: rgba(255, 255, 255, 0.65);
        .ant-menu-item,
        .ant-menu-item-group-title,
        .ant-menu-item > a {
            color: rgba(255, 255, 255, 0.65);
        }
        .ant-menu-item-active {
          background: #272733;
          color: #272733;
        }
      }
      .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
        background-color: rgba(255, 255, 255, 0.05);
      }
      .ant-layout-sider {
        background: #001529;
      }
      .ant-card-head {
        color: rgba(255, 255, 255, 0.85);
        background: transparent;
        border-bottom-color: #17171f;
      }
      .ant-card-bordered {
        border-color: #17171f;
      }
      .ant-table {
        color: rgba(255, 255, 255, 0.65);
      }
      .ant-table-thead {
        > tr > th {
          color: rgba(255, 255, 255, 0.85);
          background: #2d2d3b;
          border-bottom-color: #17171f;
        }
      }
      .ant-table-tbody {
        tr {
          > td {
            border-bottom-color: #17171f;
          }
        }
      }
      .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
      .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
      .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
      .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
        background: #383847;
      }
      .ant-table-thead > tr.ant-table-row-selected > td.ant-table-column-sort,
      .ant-table-tbody > tr.ant-table-row-selected > td.ant-table-column-sort {
        background: #383847;
      }
      .ant-table-thead > tr:hover.ant-table-row-selected > td,
      .ant-table-tbody > tr:hover.ant-table-row-selected > td {
        background: #383847;
      }
      .ant-table-thead > tr:hover.ant-table-row-selected > td.ant-table-column-sort,
      .ant-table-tbody > tr:hover.ant-table-row-selected > td.ant-table-column-sort {
        background: #383847;
      }
      .ant-list {
        color: rgba(255, 255, 255, 0.65);
        .ant-list-split .ant-list-item {
          border-bottom-color: #17171f;
        }
      }
      .ant-pagination {
        color: rgba(255, 255, 255, 0.65);
        .ant-pagination-prev,
        .ant-pagination-next,
        .ant-pagination-jump-prev,
        .ant-pagination-jump-next {
          color: rgba(255, 255, 255, 0.65);
        }
        .ant-pagination-disabled a,
        .ant-pagination-disabled:hover a,
        .ant-pagination-disabled:focus a,
        .ant-pagination-disabled .ant-pagination-item-link,
        .ant-pagination-disabled:hover .ant-pagination-item-link,
        .ant-pagination-disabled:focus .ant-pagination-item-link {
          color: rgba(255, 255, 255, 0.25);
          border-color: #17171f;
        }
        .ant-pagination-prev .ant-pagination-item-link,
        .ant-pagination-next .ant-pagination-item-link {
          background-color: #23232e;
          border-color: #17171f;
        }
        .ant-pagination-item {
          background-color: #23232e;
          border-color: #17171f;
        }
        .ant-pagination-item-active {
          background: #23232e;
          border-color: #1890ff;
        }
      }
      .anticon {
        color: rgba(255, 255, 255, 0.65);
      }
    }
    body.light {
      .ant-layout-sider {
        background: #fff;
      }
      .ant-layout-sider-trigger {
        color: rgba(0, 0, 0, 0.65);
        background: #fff;
      }
    }
`

export default globalStyles
