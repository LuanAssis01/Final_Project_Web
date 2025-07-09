export class Filter {
  constructor({ course, status, key_word }) {
    this.course = course;
    this.status = status;
    this.key_word = key_word;
  }

  async apply(projects) {
    return projects.filter(project => {
      return (
        (!this.course || project.course === this.course) &&
        (!this.status || project.status === this.status) &&
        (!this.key_word || project.key_word == this.key_word)
      );
    });
  }
}
