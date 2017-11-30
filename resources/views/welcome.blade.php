<!DOCTYPE html>
<html>
    @include('includes.header')
    <body>
        <div class="bg_container"></div>
        <div class="bg_container"></div>
        <div class="container-fluid">
            <div class="container">
                <div class="col-sm-8 col-sm-offset-2" >
                    <h1> Are you Ready for Challenge? </h1>
                    
                    <div class="row ">
                        <h2> Enter Competitor Details Below</h2>
                        <div class="col-md-10">

                            <form action="{{url('user/add/details')}}" method="post">
                                <div class="form-group">
                                    <label for="email">Email address:</label>
                                    <input type="email" class="form-control" id="email" name="email">                                
                                    
                                </div>
                                
                                <span>
                                    @if($errors->has('email'))
                                    <p style="color:white;">
                                         {{ $errors->first('email') }}
                                    </p>
                                
                                    @endif
                                </span>
                                <div class="form-group">
                                    <label for="fullname">Full Name : </label>
                                    <input type="text" class="form-control" id="fullname"  name="fullname">
                                </div>
                                 <span>
                                    @if($errors->has('fullname'))
                                    <p style="color:white;">
                                         {{ $errors->first('fullname') }}
                                    </p>
                                
                                    @endif
                                </span>
                                <div class="form-group">
                                    <label for="mobile">Mobile : </label>
                                    <input type="number" class="form-control" id="mobile" name="mobile">
                                </div>
                                <span>
                                    @if($errors->has('mobile'))
                                    <p style="color:white;">
                                         {{ $errors->first('mobile') }}
                                    </p>
                                
                                    @endif
                                </span>
                                <div class="form-group">
                                    <button  class="btn btnNew btnSubmit">Submit</button>
                                </div>
                            </form>
                        </div>

                    </div>                  
                </div>
            </div>
        </div>
        @yield('content')
        <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
        @include('includes.footer')
    </body>
</html>
