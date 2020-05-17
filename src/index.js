import "./styles.css";
import cytoscape from "cytoscape";
import noOverlap from 'cytoscape-no-overlap';
import $ from 'jquery';
import contextMenus from 'cytoscape-context-menus';
import cola from 'cytoscape-cola';
import "side-drawer";

import ProcessNode from './node'

import 'cytoscape-context-menus/cytoscape-context-menus.css';

// register extension
cytoscape.use(noOverlap);
cytoscape.use(contextMenus, $)
cytoscape.use(cola);
const cy = cytoscape({
  container: document.getElementById("cy"),
  /* elements: [
    { data: { id: "a" } },
    { data: { id: "b" } },
    { data: { id: "c" } },
    {
      data: {
        id: "ab",
        source: "a",
        target: "b"
      }
    },
    {
      data: {
        id: "ac",
        source: "a",
        target: "c"
      }
    },
    {
      data: {
        id: "cb",
        source: "c",
        target: "b"
      }
    }
  ], */
  zoomingEnabled: true,
  elements: [
    // nodes
    { data: { id: "node", name: 'node', path: '/bin/node' } },
    { data: { id: "ngnix", name: 'ngnix', path: '/bin/ngnix' } },
    { data: { id: "mongodb", name: 'mongodb', path: '/bin/mongodb' } },

    /*  { data: { id: "node1" } },
     { data: { id: "ngnix1" } },
     { data: { id: "mongodb1" } }, */
    // edges
    {
      data: {
        id: "ngnix-node",
        source: "ngnix",
        target: "node"
      }
    },
    {
      data: {
        id: "node-mongodb",
        source: "node",
        target: "mongodb"
      }
    },
    {
      data: {
        id: "mongodb-node",
        source: "mongodb",
        target: "node"
      }
    },
    /* {
      data: {
        id: "ngnix-node1",
        source: "ngnix1",
        target: "node1"
      }
    },
    {
      data: {
        id: "node-mongodb1",
        source: "node1",
        target: "mongodb1"
      }
    },
    {
      data: {
        id: "mongodb-node1",
        source: "mongodb1",
        target: "node1"
      }
    } */
  ],
  style: [
    {
      selector: "node",
      style: {
        shape: "roundrectangle",
        // "background-color": "steelblue",
        // color: "steelblue",
        // label: "data(id)",
        width: 256,
        height: 147,
        "background-image": renderNode,
        'border-radius': '70%',
        'background-opacity': '0'
        // "haystack-radius": '10px'
        // "padding-bottom":'10rem'
      }
    },
    {
      selector: "edge",
      style: {
        width: 1,
        "line-color": "black",
        "target-arrow-color": "black",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier"
      }
    }
  ]
});

/* for (var i = 0; i < 10; i++) {
  cy.add({
    data: { id: "node" + i }
  });
  var source = "node" + i;
  cy.add({
    data: {
      id: "edge" + i,
      source: source,
      target: i % 2 === 0 ? "a" : "b"
    }
  });
} */

cy.layout({
  name: "circle",
  fit: true, // whether to fit the viewport to the graph
  directed: true,
  avoidOverlap: true,
  spacingFactor: 1,
}).run();

cy.nodes().noOverlap({ padding: 5 });


function renderNode(ele) {
  // const fontFamily = '"Lucida Grande", Times';
  // console.info({ ele, name: ele.data('id') });

  // Note: if double quotes are used to enclose multiple word font names the
  // `font-family` attribute value (see <text> element) must use single quotes.
  // Otherwise no rendering would take place due to malformed SVG.
  const svg = ProcessNode({ name: ele.data('name'), path: ele.data('path') });

  /* return {
    svg: "data:image/svg+xml;base64," + btoa(svg),
    width: 100,
    height: 50
  }; */
  return "data:image/svg+xml;base64," + btoa(svg);
}

cy.contextMenus({
  menuItems: [
    {
      id: 'remove',
      content: 'remove',
      tooltipText: 'remove',
      image: { src: "remove.svg", width: 12, height: 12, x: 6, y: 4 },
      selector: 'node, edge',
      onClickFunction: function (event) {
        var target = event.target || event.cyTarget;
        target.remove();
      },
      hasTrailingDivider: true
    },
    {
      id: 'hide',
      content: 'hide',
      tooltipText: 'hide',
      selector: '*',
      onClickFunction: function (event) {
        var target = event.target || event.cyTarget;
        target.hide();
      },
      disabled: false
    },
    {
      id: 'add-node',
      content: 'add node',
      tooltipText: 'add node',
      image: { src: "add.svg", width: 12, height: 12, x: 6, y: 4 },
      coreAsWell: true,
      onClickFunction: function (event) {
        var data = {
          group: 'nodes'
        };

        var pos = event.position || event.cyPosition;

        cy.add({
          data: data,
          position: {
            x: pos.x,
            y: pos.y
          }
        });
      }
    },
    {
      id: 'remove-selected',
      content: 'remove selected',
      tooltipText: 'remove selected',
      image: { src: "remove.svg", width: 12, height: 12, x: 6, y: 6 },
      coreAsWell: true,
      onClickFunction: function (event) {
        cy.$(':selected').remove();
      }
    },
    {
      id: 'select-all-nodes',
      content: 'More Info',
      tooltipText: 'More Info',
      selector: 'node',
      onClickFunction: function (event) {
        // selectAllOfTheSameType(event.target || event.cyTarget);
        console.info({ event, name: event.target.data('name') })

        var drawer = $('#drawer');
        drawer[0].open = true;
        drawer[0].innerHTML = `
           <div style="padding: 10px">
          <h4> ${event.target.data('name')}</h4>
          </div>
        `
      }
    },
    {
      id: 'select-all-edges',
      content: 'select all edges',
      tooltipText: 'select all edges',
      selector: 'edge',
      onClickFunction: function (event) {
        selectAllOfTheSameType(event.target || event.cyTarget);
      }
    }
  ]
});




$(document).ready(function () {
  var drawer = $('#drawer');
  drawer.open = true;
});