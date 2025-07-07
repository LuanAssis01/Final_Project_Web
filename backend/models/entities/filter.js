export class Filter {
  constructor({ area, category, location, status }) {
    this.area = area;
    this.category = category;
    this.location = location;
    this.status = status;
  }

  async apply(projects) {
    return projects.filter(project => {
      return (
        (!this.area || project.thematicArea === this.area) &&
        (!this.category || project.category === this.category) &&
        (!this.location || project.location === this.location) &&
        (!this.status || project.status === this.status)
      );
    });
  }
}
