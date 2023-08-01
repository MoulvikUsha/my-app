import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { TooltipModule } from "ngx-tooltip";

interface HierarchyDatum {
  name: string;
  value: number;
  children?: Array<HierarchyDatum>;
}

const data: HierarchyDatum = {
  name: "A1",
  value: 100,
  children: [
    {
      name: "B1",
      value: 100,
      children: [
        {
          name: "C1",
          value: 100,
          children: undefined
        },
        {
          name: "C2",
          value: 300,
          // children: [
          //   {
          //     name: "D1",
          //     value: 100,
          //     children: undefined
          //   },
          //   {
          //     name: "D2",
          //     value: 300,
          //     children: undefined
          //   }
          // ]
        },
        // {
        //   name: "C3",
        //   value: 200,
        //   children: undefined
        // }
      ]
    },
    {
      name: "B2",
      value: 200,
      children: [
        {
          name: "C4",
          value: 100,
          children: undefined
        },
        {
          name: "C5",
          value: 300,
          children: undefined
        },
        // {
        // name: "C6",
        // value: 200,
        // children: [
        //   {
        //     name: "D3",
        //     value: 100,
        //     children: undefined
        //   },
        //   {
        //     name: "D4",
        //     value: 300,
        //     children: undefined
        //   }
        // ]
        // }
      ]
    }
  ]
};

@Component({
  selector: 'app-d3-tree',
  templateUrl: './d3-tree.component.html',
  styleUrls: ['./d3-tree.component.scss']
})
export class D3TreeComponent implements AfterViewInit {

  @ViewChild('chart', { static: true }) private chartContainer: ElementRef | any;
  root: any;
  tree: any;
  treeLayout: any;
  svg: any;
  treeData: any;
  height!: number;
  width!: number;
  margin: any = { top: 200, bottom: 90, left: 400, right: 90 };
  duration: number = 750;
  nodeWidth: number = 5;
  nodeHeight: number = 5;
  nodeRadius: number = 5;
  horizontalSeparationBetweenNodes: number = 5;
  verticalSeparationBetweenNodes: number = 5;
  nodeTextDistanceY: string = "-5px";
  nodeTextDistanceX: number = 5;
  dragStarted!: boolean;
  draggingNode: any;
  nodes: any[] = [];
  selectedNodeByDrag: any;
  selectedNodeByClick: any;
  previousClickedDomNode: any;
  links: any;
  tooltip: any;
  nodeName: any;
  nodeValue: any;
  connectedNodess: any[] = [];
  connectedNodes: any;
  children: boolean = false;

  constructor() { }

  ngOnInit() {
    // this.renderTreeChart();
  }

  ngAfterViewInit() {
    this.renderTreeChart();
  }

  renderTreeChart() {
    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg = d3.select("#chart").append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight)
      .append("g")
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // declares a tree layout and assigns the size
    this.tree = d3.tree()
      .size([this.height, this.width])
      .separation((a, b) => {
        return a.parent == b.parent ? 10 : 5
      });

    // Assigns parent, children, height, depth
    this.root = d3.hierarchy(data, (d) => { return d.children; });
    this.root.x0 = this.height / 2;
    this.root.y0 = 10;
    this.updateChart(this.root);

  }

  click = (d: any) => {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.updateChart(d);
  }

  showCustomMenu(node: any) {
    let element = this.chartContainer.nativeElement;
    const customMenu = document.getElementById('customMenu');
    const menuPosition = { x: node.x0, y: node.y0 };
    // customMenu!.style.left = `${menuPosition.y}px`;
    // customMenu!.style.top = `${menuPosition.x}px`;
    customMenu!.style.display = 'block';
    this.nodeName = node.data.name;
    this.nodeValue = node.data.value;
    if (node.hasOwnProperty('children')) {
      node.children.forEach((nodes: any) => {
        this.connectedNodess.push(nodes.data.name);
        this.connectedNodes = this.connectedNodess.join(',')
      });
      this.children = true;
    }
    else {
      this.children = false
      this.nodeName = node.data.name;
      this.nodeValue = node.data.value;
    }
  }

  hideCustomMenu(node: any) {
    const customMenu = document.getElementById('customMenu');
    customMenu!.style.display = 'none';
    if (node.hasOwnProperty('children')) {
      node.children.forEach((nodes: any) => {
        this.connectedNodess.pop();
      });
    }
  }

  updateChart(source: any) {
    let i = 0;
    this.treeData = this.tree(this.root);

    this.nodes = this.treeData.descendants();
    this.links = this.treeData.descendants().slice(1);
    this.nodes.forEach((d) => { d.y = d.depth * 180 });

    let node = this.svg
      .selectAll('g.node')
      .data(this.nodes, (d: any) => { return d.id || (d.id = ++i); });

    let nodeEnter = node.enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => { return 'translate(' + source.y0 + ',' + source.x0 + ')' })
      .on('click', this.click)
      .on('mouseover', (d: any) => {
        this.showCustomMenu(d); // Show the custom menu on mouseover
      })
      .on('mouseout', (d: any) => {
        this.hideCustomMenu(d); // Hide the custom menu on mouseout
      });


    nodeEnter.append('circle')
      .attr("id", "customTooltip")
      .attr('class', 'node')
      .attr('r', 1e-6)
      .attr('matTooltip', (d: any) => d.data.name)
      .attr('matTooltipPosition', 'above')
      .text((d: any) => d.data.name)
      .style('fill', (d: any) => {
        return d._children ? 'lightsteelblue' : '#fff';
      });

    nodeEnter.append('text')
      .attr('dy', '.35em')
      .attr('x', (d: any) => {
        return d.children || d._children ? -13 : 13;
      })
      .attr('text-anchor', (d: any) => {
        return d.children || d._children ? 'end' : 'start';
      })
      .style('font', '12px sans-serif')
      .text((d: any) => { return d.data.name; });

    let nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
      .duration(this.duration)
      .attr('transform', (d: any) => {
        return 'translate(' + d.y + ',' + d.x + ')';
      });

    nodeUpdate.select('circle.node')
      .attr('r', 8)
      .style('stroke-width', '3px')
      .style('stroke', (d: any) => {
        if (d.data.value > 100) {
          return d ? 'red' : '#fff';
        }
        else {
          return d ? 'orange' : '#fff'
        }
      })
      .style('fill', (d: any) => { return d._children ? 'lightsteelblue' : '#fff' })
      .attr('cursor', 'pointer');

    let nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr('transform', (d: any) => { return 'translate(' + source.y + ',' + source.x + ')' })
      .remove();

    nodeExit.select('circle')
      .attr('r', 1e-6);

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

    let link = this.svg.selectAll('path.link')
      .data(this.links, (d: any) => { return d.id; });

    let linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .style('fill', 'none')
      .style('stroke', 'steelblue')
      .style('stroke-width', '2px')
      .attr('d', function (d: any) {
        let o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });

    let linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
      .duration(this.duration)
      .attr('d', (d: any) => { return diagonal(d, d.parent); });

    let linkExit = link.exit().transition()
      .duration(this.duration)
      .attr('d', function (d: any) {
        let o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .remove();

    this.nodes.forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    function diagonal(s: any, d: any) {
      let path = `M ${s.y} ${s.x}
                  C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
      return path;
    }
  }

}
