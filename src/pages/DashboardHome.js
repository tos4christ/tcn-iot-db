import React from "react";
import DashboardNav from '../components/Header/DashboardNav';
import AccidentAreas from '../components/Charts/AccidentAreas';
import AccidentRep from '../components/Charts/AccidentsRep';

const DashboardHome = () => {
  const body = <div className='container-fluid' >
    <div className="row my-4 pt-4 text-justify">
      <div className="col-sm-4">
        <div className='bg-white shadow m-1 p-3'>
          <AccidentAreas/>
        </div>
        {/* <div className="row mt-4">
          <div className="col-sm-6 ">
            <div className="bg-white shadow m-1 p-3"><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam quas, non molestias voluptate
            vero veniam! </p></div>

          </div>
          <div className="col-sm-6 ">
            <div className="bg-white shadow m-1 p-3"><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam quas, non molestias voluptate
            vero veniam! </p></div>

          </div>
          </div> */}
      </div>
      <div className="col-sm-8">
        <div className='bg-white shadow m-1 p-3'><AccidentRep/></div>
        {/* <div className="row mt-4">
          <div className="col-sm-6 ">
            <div className="bg-white shadow m-1 p-3"><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam quas, non molestias voluptate
             vero veniam! In aliquid provident quisquam eius. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, officiis,
              laboriosam rerum molestiae tempora numquam optio cumque 
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, consequatur! Lorem, ipsum dolor sit amet 
             consectetur adipisicing elit. Cumque, nesciunt? accusamus hic temporibus animi soluta, maxime recusandae voluptate 
             natus magni delectus vero ut.</p></div>
            
          </div>
          <div className="col-sm-6 ">
            <div className="bg-white shadow m-1 p-3"><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam quas, non molestias voluptate
             vero veniam! In aliquid provident quisquam eius. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, officiis,
              laboriosam rerum molestiae tempora numquam optio cumque 
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, consequatur! Lorem, ipsum dolor sit amet 
             consectetur adipisicing elit. Cumque, nesciunt? accusamus hic temporibus animi soluta, maxime recusandae voluptate 
             natus magni delectus vero ut.</p></div>
            
          </div>
        </div> */}
      </div>
    </div>
  </div>
  return(
    <DashboardNav body={body}/>
  )
};

export default DashboardHome;
