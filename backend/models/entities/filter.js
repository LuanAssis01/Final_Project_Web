export class Filter {
  static apply(projects, filters) {
    return projects.filter(project => {
      const matchArea = !filters.area || project.thematicArea === filters.area;
      const matchCategory = !filters.category || project.category === filters.category;
      const matchLocation = !filters.location || project.location === filters.location;
      const matchStatus = !filters.status || project.status === filters.status;
      return matchArea && matchCategory && matchLocation && matchStatus;
    });
  }
}
