/**
 * generic-words.ts
 * A JavaScript Generic Algorithm Demo By TypeScript
 * @authors Nagisa (nagisa_tk@outlook.com)
 * @date    2017-06-08 12:25:33
 * @version 0.9
 */
var alphas = "1234567890 abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.><!'\",`~@#$%^&*()-_=+\\|}{[];:?/";
// let alphas = "abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ,.?:;'\"!"
// let alphas = "|VDg4suMX9`,%@-_6:YrwBL#J=Q()i ]21KWCT0Ee}Ik~A5\\G+p'a;<bdR>F*qZS.!hz8\"l7vHjU?cnt{[f&^xNmyOoP3$/"
var len = alphas.length;
var random_alphas = "";
while (random_alphas.length < len) {
    var x = alphas[Math.floor(Math.random() * len - 1) + 1];
    if (random_alphas.indexOf(x) === -1)
        random_alphas += x;
}
alphas = random_alphas;
var Member = (function () {
    function Member(code) {
        this.code = code;
        this.eval = 0;
    }
    Member.prototype.mate = function (other) {
        var mid = Math.floor(this.code.length / 2);
        var child1 = this.code.substr(0, mid) + other.code.substr(mid);
        var child2 = other.code.substr(0, mid) + this.code.substr(mid);
        return [new Member(child1), new Member(child2)];
    };
    Member.prototype.equals = function (other) {
        return this.code === other.code;
    };
    return Member;
}());
var Group = (function () {
    function Group(goal, size) {
        if (size === void 0) { size = 10; }
        this.members = [];
        this.genes = alphas;
        this.mutation_rate = 0.3;
        this.goal = goal;
        while (this.members.length < size) {
            this.members.push(this.born());
        }
        this.evaluate_members();
        this.sort_by_eval();
    }
    Group.prototype.set_genes = function (genes) {
        this.genes = genes;
    };
    Group.prototype.set_mutation_rate = function (rate) {
        if (rate >= 1) {
            console.log('Bad rate');
            return;
        }
        this.mutation_rate = rate;
    };
    Group.prototype.size = function () {
        return this.members.length;
    };
    Group.prototype.born = function () {
        var new_code = '';
        while (new_code.length < this.goal.length) {
            new_code += this.genes[Math.floor(Math.random() * this.genes.length)];
        }
        return new Member(new_code);
    };
    Group.prototype.mutate = function () {
        for (var _i = 0, _a = this.members; _i < _a.length; _i++) {
            var m = _a[_i];
            if (Math.random() < this.mutation_rate) {
                var index = Math.floor(Math.random() * (m.code.length));
                var front = m.code.substr(0, index);
                var inalphas = this.genes.indexOf(m.code[index]);
                var change = 0;
                if (inalphas === 0) {
                    change = 1;
                }
                else if (inalphas === this.genes.length - 1) {
                    change = -1;
                }
                else {
                    change = Math.random() > 0.5 ? -1 : 1;
                }
                var mid = this.genes[inalphas + change];
                var end = m.code.substr(index + 1);
                m.code = front + mid + end;
            }
        }
    };
    Group.prototype.evaluate_members = function () {
        for (var _i = 0, _a = this.members; _i < _a.length; _i++) {
            var mem = _a[_i];
            mem.eval = 0;
            for (var i = 0; i < this.goal.length; i++) {
                var div = this.genes.indexOf(mem.code[i]) - this.genes.indexOf(this.goal[i]);
                mem.eval += (div * div);
            }
        }
    };
    Group.prototype.sort_by_eval = function () {
        this.members.sort(function (a, b) {
            return a.eval - b.eval;
        });
    };
    Group.prototype.propagate = function () {
        this.mutate();
        var size = this.size();
        var index = Math.floor(Math.random() * size);
        var new_mems = this.members[0].mate(this.members[index]).concat(this.members);
        this.members = [];
        for (var _i = 0, new_mems_1 = new_mems; _i < new_mems_1.length; _i++) {
            var new_mem = new_mems_1[_i];
            var not_in_memebers = true;
            for (var _a = 0, _b = this.members; _a < _b.length; _a++) {
                var old_mem = _b[_a];
                if (new_mem.equals(old_mem)) {
                    not_in_memebers = false;
                }
            }
            if (not_in_memebers) {
                this.members.push(new_mem);
            }
        }
        while (this.size() < size) {
            this.members.push(this.born());
        }
        this.evaluate_members();
        this.sort_by_eval();
        if (this.size() > size) {
            this.members = this.members.slice(0, size);
        }
    };
    return Group;
}());
